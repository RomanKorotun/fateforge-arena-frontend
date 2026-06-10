import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import "./BattlePage.css";
import { battleSocket } from "../../socket/battleSocket";
import { authStore } from "../../store/authStore";

const BattlePage = () => {
  const navigate = useNavigate();

  const { user } = authStore();

  const [activeBattle, setActiveBattle] = useState(null);
  const [roundTimer, setRoundTimer] = useState(0);
  // const [battleTimer, setBattleTimer] = useState(0);
  const [attack, setAttack] = useState(null);
  const [defense, setDefense] = useState(null);
  const [players, setPlayers] = useState([]);
  const [battles, setBattles] = useState([]);
  const [duels, setDuels] = useState([]);

  // console.log("battleTimer", battleTimer);
  // console.log("roundTimer", roundTimer);

  useEffect(() => {
    battleSocket.emit("online:join");
    battleSocket.emit("duel:get-pending");
    battleSocket.emit("battle:get-active");
    battleSocket.emit("battle:get-my-active");

    const onOnline = (users) => {
      setPlayers(users);
    };

    const onDuels = (duels) => {
      setDuels(duels);
    };

    const onCreatedDuel = (duel) => {
      setDuels((prev) => [...prev, duel]);
    };

    const onRemovedDuel = (id) => {
      setDuels((prev) => prev.filter((duel) => duel.id !== id));
    };

    const onCreateDuelError = (data) => {
      toast.error(data.message);
    };

    const onBattles = (battles) => {
      setBattles(battles);
    };

    const onCreatedBattle = (battle) => {
      setBattles((prev) => [...prev, battle]);
    };

    const onAcceptDuelError = (data) => {
      toast.error(data.message);
    };

    const onBattleStarted = (battle) => {
      console.log(battle);
      setActiveBattle(battle);
    };

    const onMyBattle = (battle) => {
      console.log("myBattle", battle);
      setActiveBattle(battle);
    };

    const onBattleUpdated = (battle) => {
      console.log("updated myBattle", battle);
      setActiveBattle(battle);
    };

    const onRoundResult = (battle) => {
      console.log("result", battle);
      if (battle.status === "finished") {
        setBattles((prev) => prev.filter((b) => b.id !== battle.id));
        setRoundTimer(0);
        // setBattleTimer(0);
      }
      setActiveBattle(battle);
    };

    // const onFinished = (battle) => {
    //   console.log(battle);
    //   setActiveBattle(battle);
    //   setRoundTimer(0);
    //   setBattleTimer(0);
    // };

    battleSocket.on("online:updated", onOnline);
    battleSocket.on("duel:list", onDuels);
    battleSocket.on("duel:created", onCreatedDuel);
    battleSocket.on("duel:removed", onRemovedDuel);
    battleSocket.on("duel:create:error", onCreateDuelError);
    battleSocket.on("battle:list", onBattles);
    battleSocket.on("battle:created", onCreatedBattle);
    battleSocket.on("duel:accept:error", onAcceptDuelError);
    battleSocket.on("battle:started", onBattleStarted);
    battleSocket.on("battle:my-active", onMyBattle);
    battleSocket.on("battle:updated", onBattleUpdated);
    battleSocket.on("battle:round-result", onRoundResult);
    // battleSocket.on("battle:finished", onFinished);

    return () => {
      battleSocket.off("online:updated", onOnline);
      battleSocket.off("duel:list", onDuels);
      battleSocket.off("duel:created", onCreatedDuel);
      battleSocket.off("duel:removed", onRemovedDuel);
      battleSocket.off("duel:create:error", onCreateDuelError);
      battleSocket.off("battle:list", onBattles);
      battleSocket.off("battle:created", onCreatedBattle);
      battleSocket.off("duel:accept:error", onAcceptDuelError);
      battleSocket.off("battle:started", onBattleStarted);
      battleSocket.off("battle:my-active", onMyBattle);
      battleSocket.off("battle:updated", onBattleUpdated);
      battleSocket.off("battle:round-result", onRoundResult);
      // battleSocket.off("battle:finished", onFinished);
    };
  }, []);

  //======================================

  useEffect(() => {
    // const onTimer = (data) => {
    //   if (!activeBattle) return;
    //   if (data.battleId !== activeBattle.id) return;

    //   setRoundTimer(Math.ceil(data.roundLeft / 1000));
    //   setBattleTimer(Math.ceil(data.battleLeft / 1000));
    // };

    const onTimer = (data) => {
      if (!activeBattle) return;
      if (activeBattle.status === "finished") return;
      if (data.battleId !== activeBattle.id) return;

      setRoundTimer(Math.ceil(data.roundLeft / 1000));
      // setBattleTimer(Math.ceil(data.battleLeft / 1000));
    };

    battleSocket.on("battle:timer", onTimer);

    return () => {
      battleSocket.off("battle:timer", onTimer);
    };
  }, [activeBattle]);

  //============================================

  useEffect(() => {
    return () => {
      battleSocket.emit("online:leave");
    };
  }, []);

  const createDuel = () => {
    battleSocket.emit("duel:create");
  };

  const joinDuel = (duelId) => {
    battleSocket.emit("duel:accept", { duelId });
  };

  const handleSubmitMove = () => {
    if (!activeBattle) return;
    if (!attack || !defense) return;

    battleSocket.emit("battle:move", {
      roomId: activeBattle.id,
      attackZone: attack,
      defenseZone: defense,
    });

    setAttack(null);
    setDefense(null);
  };

  const myId = user.id;

  const isPlayer1 = activeBattle?.player1Id === myId;

  const myMoves = isPlayer1
    ? activeBattle?.player1MovesHistory
    : activeBattle?.player2MovesHistory;

  const enemyMoves = isPlayer1
    ? activeBattle?.player2MovesHistory
    : activeBattle?.player1MovesHistory;

  return (
    <div className="battle-page">
      <div className="battle-container">
        {/* TOP BAR */}
        <div className="battle-topbar">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ⬅ Back to profile
          </button>
        </div>

        {/* MAIN 3 COLUMNS */}
        <div className="battle-card">
          <div className="header-actions">
            <button className="create-btn" onClick={createDuel}>
              + Create Duel
            </button>

            <button
              className="leaderboard-btn"
              onClick={() => navigate("/dashboard/battle/rating")}
            >
              🏆 Rating
            </button>
          </div>

          <div className="battle-layout">
            {/* USERS */}
            <div className="panel">
              <div className="panel-title">🟢 Online Players</div>

              <div className="panel-scroll">
                {players.length === 0 && (
                  <div className="empty">No online players</div>
                )}

                {players.map((p) => (
                  <div key={p.id} className="player">
                    <div className="player-info">
                      <div className="name">👤 {p.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DUELS */}
            <div className="panel">
              <div className="panel-title">⚔ Pending Duels</div>

              <div className="panel-scroll">
                {duels.length === 0 && (
                  <div className="empty">No duels available</div>
                )}

                {duels.map((d) => (
                  <div key={d.id} className="room">
                    <div className="room-left">
                      <div className="room-id">D-{d.id?.slice(0, 6)}</div>
                      <div className="room-owner">
                        🧑‍⚔️ Challenger: {d.challengerUsername}
                      </div>
                    </div>

                    <button className="join" onClick={() => joinDuel(d.id)}>
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* BATTLES LIST */}
            <div className="panel">
              <div className="panel-title">🔥 Battle Rooms</div>

              <div className="panel-scroll">
                {battles.length === 0 && (
                  <div className="empty">No active battles</div>
                )}

                {battles.map((b) => (
                  <div key={b.id} className="room">
                    <div className="room-left">
                      <div className="room-id">B-{b.id?.slice(0, 6)}</div>
                      <div className="room-owner">
                        ⚔ {b.player1Id} vs {b.player2Id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="battle-bottom">
          {/* ================= ARENA ================= */}

          <div className="battle-arena">
            {!activeBattle ? (
              <div className="battle-empty">No active battle</div>
            ) : (
              <>
                <div className="arena-title">⚔ ACTIVE BATTLE</div>

                <div className="arena-top">
                  <div className="fighter-card">
                    <div className="fighter-name">YOU</div>
                    <div className="fighter-hp">
                      ❤️{" "}
                      {isPlayer1
                        ? activeBattle.player1Health
                        : activeBattle.player2Health}
                    </div>
                  </div>

                  <div className="arena-timers">
                    {/* <div>⏱ Battle: {battleTimer}s</div> */}
                    {/* <div>⏱ Round: {roundTimer}s</div> */}
                    <div>⚔ Round: {activeBattle.currentRound}</div>
                    <div>⏱ Time: {roundTimer}s</div>
                  </div>

                  <div className="fighter-card">
                    <div className="fighter-name">ENEMY</div>
                    <div className="fighter-hp">
                      ❤️{" "}
                      {isPlayer1
                        ? activeBattle.player2Health
                        : activeBattle.player1Health}
                    </div>
                  </div>
                </div>

                <div className="battle-actions">
                  <div className="action-block">
                    <div className="action-title">ATTACK</div>
                    <div className="action-buttons">
                      <button onClick={() => setAttack("HEAD")}>HEAD</button>
                      <button onClick={() => setAttack("BODY")}>BODY</button>
                      <button onClick={() => setAttack("LEGS")}>LEGS</button>
                    </div>
                  </div>

                  <div className="action-block">
                    <div className="action-title">DEFENSE</div>
                    <div className="action-buttons">
                      <button onClick={() => setDefense("HEAD")}>HEAD</button>
                      <button onClick={() => setDefense("BODY")}>BODY</button>
                      <button onClick={() => setDefense("LEGS")}>LEGS</button>
                    </div>
                  </div>
                </div>

                <div className="submit-move">
                  <button
                    className="submit-btn"
                    onClick={handleSubmitMove}
                    disabled={!attack || !defense}
                  >
                    SUBMIT MOVE
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ================= HISTORY ================= */}

          <div className="battle-history">
            <div className="history-title">⚔ Battle History</div>

            {activeBattle?.status === "finished" ? (
              activeBattle.winnerId ? (
                <div
                  className={`winner-banner ${
                    activeBattle.winnerId === myId ? "win" : "lose"
                  }`}
                >
                  {activeBattle.winnerId === myId
                    ? "🏆 YOU WIN"
                    : "💀 YOU LOSE"}
                </div>
              ) : (
                <div className="winner-banner draw">⚖ DRAW</div>
              )
            ) : (
              <div className="winner-banner live">🔥 IN PROGRESS</div>
            )}

            {/* ================= SINGLE SCROLL AREA ================= */}
            <div className="history-scroll">
              <div className="history-grid">
                {/* YOU */}
                <div className="history-col">
                  <div className="col-title you">YOU</div>

                  {[...(myMoves || [])]
                    .slice()
                    .reverse()
                    .map((move, index) => (
                      <div key={index} className="history-round">
                        <div className="round-header">Round #{move.round}</div>
                        <div>⚔ Attack: {move.attackZone}</div>
                        <div>🛡 Defense: {move.defenseZone}</div>
                        <div>💥 Damage: {move.damage}</div>
                        <div>
                          ❤️ HP: {move.hpBefore} → {move.hpAfter}
                        </div>
                      </div>
                    ))}
                </div>

                {/* ENEMY */}
                <div className="history-col">
                  <div className="col-title enemy">ENEMY</div>

                  {[...(enemyMoves || [])]
                    .slice()
                    .reverse()
                    .map((move, index) => (
                      <div key={index} className="history-round">
                        <div className="round-header">Round #{move.round}</div>
                        <div>⚔ Attack: {move.attackZone}</div>
                        <div>🛡 Defense: {move.defenseZone}</div>
                        <div>💥 Damage: {move.damage}</div>
                        <div>
                          ❤️ HP: {move.hpBefore} → {move.hpAfter}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattlePage;
