// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ArcPredict
 * @notice Prediction market for financial & economic events on Arc testnet
 * @dev Uses USDC as the settlement token (Arc's native gas token)
 */
contract ArcPredict is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─── Types ────────────────────────────────────────────────────────────────

    enum MarketStatus { Open, Resolved, Cancelled }
    enum Outcome { Unresolved, Yes, No }

    struct Market {
        uint256 id;
        string question;          // e.g. "Will ECB cut rates in June 2025?"
        string category;          // e.g. "Central Banks", "FX", "Crypto"
        string imageUrl;          // optional cover image
        uint256 deadline;         // last timestamp to place bets
        uint256 resolutionDate;   // when oracle/admin resolves
        uint256 totalYes;         // total USDC bet on YES
        uint256 totalNo;          // total USDC bet on NO
        uint256 minBet;           // minimum bet in USDC (6 decimals)
        MarketStatus status;
        Outcome outcome;
        address creator;
        string resolutionSource;  // e.g. "ECB official press release"
    }

    struct Position {
        uint256 yesAmount;
        uint256 noAmount;
        bool claimed;
    }

    // ─── State ────────────────────────────────────────────────────────────────

    IERC20 public immutable usdc;
    uint256 public marketCount;
    uint256 public platformFeeBps = 200; // 2% fee
    uint256 public constant MAX_FEE_BPS = 500; // 5% max
    uint256 public accumulatedFees;

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Position)) public positions;
    mapping(address => bool) public resolvers; // trusted resolvers

    // ─── Events ───────────────────────────────────────────────────────────────

    event MarketCreated(
        uint256 indexed marketId,
        string question,
        string category,
        uint256 deadline,
        address indexed creator
    );
    event BetPlaced(
        uint256 indexed marketId,
        address indexed bettor,
        bool isYes,
        uint256 amount
    );
    event MarketResolved(
        uint256 indexed marketId,
        Outcome outcome
    );
    event WinningsClaimed(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount
    );
    event MarketCancelled(uint256 indexed marketId);
    event ResolverUpdated(address indexed resolver, bool status);

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyResolver() {
        require(resolvers[msg.sender] || msg.sender == owner(), "Not a resolver");
        _;
    }

    modifier marketExists(uint256 marketId) {
        require(marketId < marketCount, "Market does not exist");
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = IERC20(_usdc);
        resolvers[msg.sender] = true;
    }

    // ─── Market Management ────────────────────────────────────────────────────

    /**
     * @notice Create a new prediction market
     */
    function createMarket(
        string calldata question,
        string calldata category,
        string calldata imageUrl,
        string calldata resolutionSource,
        uint256 deadline,
        uint256 resolutionDate,
        uint256 minBet
    ) external returns (uint256 marketId) {
        require(bytes(question).length > 0, "Empty question");
        require(deadline > block.timestamp, "Deadline in the past");
        require(resolutionDate >= deadline, "Resolution before deadline");
        require(minBet >= 1e6, "Min bet must be at least 1 USDC");

        marketId = marketCount++;

        markets[marketId] = Market({
            id: marketId,
            question: question,
            category: category,
            imageUrl: imageUrl,
            deadline: deadline,
            resolutionDate: resolutionDate,
            totalYes: 0,
            totalNo: 0,
            minBet: minBet,
            status: MarketStatus.Open,
            outcome: Outcome.Unresolved,
            creator: msg.sender,
            resolutionSource: resolutionSource
        });

        emit MarketCreated(marketId, question, category, deadline, msg.sender);
    }

    // ─── Betting ──────────────────────────────────────────────────────────────

    /**
     * @notice Place a bet on YES or NO
     * @param marketId The market to bet on
     * @param isYes true = bet YES, false = bet NO
     * @param amount Amount of USDC (6 decimals) to bet
     */
    function placeBet(
        uint256 marketId,
        bool isYes,
        uint256 amount
    ) external nonReentrant marketExists(marketId) {
        Market storage market = markets[marketId];

        require(market.status == MarketStatus.Open, "Market not open");
        require(block.timestamp < market.deadline, "Betting period ended");
        require(amount >= market.minBet, "Below minimum bet");

        usdc.safeTransferFrom(msg.sender, address(this), amount);

        Position storage pos = positions[marketId][msg.sender];

        if (isYes) {
            market.totalYes += amount;
            pos.yesAmount += amount;
        } else {
            market.totalNo += amount;
            pos.noAmount += amount;
        }

        emit BetPlaced(marketId, msg.sender, isYes, amount);
    }

    // ─── Resolution ───────────────────────────────────────────────────────────

    /**
     * @notice Resolve a market with the final outcome
     */
    function resolveMarket(
        uint256 marketId,
        bool outcomeIsYes
    ) external onlyResolver marketExists(marketId) {
        Market storage market = markets[marketId];

        require(market.status == MarketStatus.Open, "Market not open");
        require(block.timestamp >= market.resolutionDate, "Too early to resolve");

        market.status = MarketStatus.Resolved;
        market.outcome = outcomeIsYes ? Outcome.Yes : Outcome.No;

        emit MarketResolved(marketId, market.outcome);
    }

    /**
     * @notice Cancel a market and allow refunds
     */
    function cancelMarket(uint256 marketId) external onlyResolver marketExists(marketId) {
        Market storage market = markets[marketId];
        require(market.status == MarketStatus.Open, "Market not open");

        market.status = MarketStatus.Cancelled;
        emit MarketCancelled(marketId);
    }

    // ─── Claiming ─────────────────────────────────────────────────────────────

    /**
     * @notice Claim winnings after market resolution
     */
    function claimWinnings(uint256 marketId) external nonReentrant marketExists(marketId) {
        Market storage market = markets[marketId];
        Position storage pos = positions[marketId][msg.sender];

        require(!pos.claimed, "Already claimed");
        pos.claimed = true;

        uint256 payout;

        if (market.status == MarketStatus.Cancelled) {
            // Full refund
            payout = pos.yesAmount + pos.noAmount;
        } else {
            require(market.status == MarketStatus.Resolved, "Not resolved");

            uint256 winningAmount;
            uint256 totalPool = market.totalYes + market.totalNo;

            if (market.outcome == Outcome.Yes) {
                winningAmount = pos.yesAmount;
                if (market.totalYes > 0 && winningAmount > 0) {
                    payout = (winningAmount * totalPool) / market.totalYes;
                }
            } else {
                winningAmount = pos.noAmount;
                if (market.totalNo > 0 && winningAmount > 0) {
                    payout = (winningAmount * totalPool) / market.totalNo;
                }
            }

            // Deduct platform fee
            uint256 fee = (payout * platformFeeBps) / 10000;
            accumulatedFees += fee;
            payout -= fee;
        }

        require(payout > 0, "Nothing to claim");
        usdc.safeTransfer(msg.sender, payout);

        emit WinningsClaimed(marketId, msg.sender, payout);
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    /**
     * @notice Get all details of a market
     */
    function getMarket(uint256 marketId) external view returns (Market memory) {
        require(marketId < marketCount, "Market does not exist");
        return markets[marketId];
    }

    /**
     * @notice Get a user's position on a market
     */
    function getPosition(uint256 marketId, address user) external view returns (Position memory) {
        return positions[marketId][user];
    }

    /**
     * @notice Calculate implied probability of YES (in basis points, 0–10000)
     */
    function getYesProbability(uint256 marketId) external view returns (uint256) {
        Market storage market = markets[marketId];
        uint256 total = market.totalYes + market.totalNo;
        if (total == 0) return 5000; // 50% default
        return (market.totalYes * 10000) / total;
    }

    /**
     * @notice Estimate potential payout for a new bet
     */
    function estimatePayout(
        uint256 marketId,
        bool isYes,
        uint256 amount
    ) external view returns (uint256) {
        Market storage market = markets[marketId];
        uint256 total = market.totalYes + market.totalNo + amount;
        uint256 winPool = isYes ? market.totalYes + amount : market.totalNo + amount;
        if (winPool == 0) return 0;
        uint256 grossPayout = (amount * total) / winPool;
        uint256 fee = (grossPayout * platformFeeBps) / 10000;
        return grossPayout - fee;
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function setResolver(address resolver, bool status) external onlyOwner {
        resolvers[resolver] = status;
        emit ResolverUpdated(resolver, status);
    }

    function setPlatformFee(uint256 feeBps) external onlyOwner {
        require(feeBps <= MAX_FEE_BPS, "Fee too high");
        platformFeeBps = feeBps;
    }

    function withdrawFees() external onlyOwner {
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;
        usdc.safeTransfer(owner(), amount);
    }
}
