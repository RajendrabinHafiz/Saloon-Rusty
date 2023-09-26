(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [798],
  {
    1364: function (t, e, i) {
      "use strict";
      i.d(e, {
        n: function () {
          return c;
        },
      });
      var n = i(59499),
        a = i(36864),
        s = (i(2784), i(75667)),
        r = i(52322);
      function o(t, e) {
        var i = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(t);
          e &&
            (n = n.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            i.push.apply(i, n);
        }
        return i;
      }
      function h(t) {
        for (var e = 1; e < arguments.length; e++) {
          var i = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? o(Object(i), !0).forEach(function (e) {
                (0, n.Z)(t, e, i[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i))
            : o(Object(i)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(i, e),
                );
              });
        }
        return t;
      }
      var c = function (t) {
        var e = (0, a.Z)({}, t);
        return (0, r.jsx)(
          s.z,
          h(
            h({}, e),
            {},
            {
              children: "Max",
            },
          ),
        );
      };
    },
    15555: function (t, e, i) {
      "use strict";
      i.d(e, {
        X: function () {
          return s;
        },
      });
      var n = i(36557),
        a = i(75667);
      var s = (0, n.Z)(a.z, {
        target: "e1htg6fp0",
        label: "ValueButton--ValueButton",
      })({
        name: "15lst5z",
        styles: "max-width:72px;font-size:18px;line-height:18px",
      });
    },
    43876: function (t, e, i) {
      "use strict";
      i.d(e, {
        w: function () {
          return r;
        },
      });
      var n = i(37824),
        a = i(64803),
        s = i(2784),
        r = function () {
          var t = (0, a.z)();
          (0, s.useEffect)(function () {
            return function () {
              t((0, n.V0)()), t((0, n.Qc)());
            };
          }, []);
        };
    },
    92312: function (t, e, i) {
      "use strict";
      i.r(e),
        i.d(e, {
          __N_SSP: function () {
            return ge;
          },
          default: function () {
            return ye;
          },
        });
      var n,
        a = i(71383),
        s = i(36557),
        r = i(28165),
        o = i(9008),
        h = i.n(o),
        c = i(2784),
        l = i(25675),
        u = i.n(l),
        f = i(76318),
        d = "/_next/static/media/Meteoroid_1.53183c7a.png",
        p = "/_next/static/media/Meteoroid_2.915cd035.png",
        x = "/_next/static/media/Meteoroid_3.ccc5d575.png",
        m = "/_next/static/media/Meteoroid_4.fa5366c0.png",
        g = "/_next/static/media/Meteoroid_5.e46d7bf7.png",
        y = "/_next/static/media/Meteoroid_Big.678580a9.png",
        b = "/_next/static/media/UFO.55b70432.png",
        v = i(52322);
      var w = function () {
          return (0, v.jsxs)(j, {
            children: [
              (0, v.jsx)(O, {
                children: (0, v.jsx)(u(), {
                  src: d,
                  width: 69,
                  height: 61,
                }),
              }),
              (0, v.jsx)(A, {
                children: (0, v.jsx)(u(), {
                  src: p,
                  width: 60,
                  height: 53,
                }),
              }),
              (0, v.jsx)(C, {
                children: (0, v.jsx)(u(), {
                  src: x,
                  width: 51,
                  height: 42,
                }),
              }),
              (0, v.jsx)(B, {
                children: (0, v.jsx)(u(), {
                  src: m,
                  width: 103,
                  height: 76,
                }),
              }),
              (0, v.jsx)(k, {
                children: (0, v.jsx)(u(), {
                  src: g,
                  width: 65,
                  height: 54,
                }),
              }),
              (0, v.jsx)(P, {
                children: (0, v.jsx)(u(), {
                  src: y,
                  width: 252,
                  height: 201,
                }),
              }),
              (0, v.jsx)(I, {
                children: (0, v.jsx)(u(), {
                  src: b,
                  width: 90,
                  height: 48,
                }),
              }),
            ],
          });
        },
        Z = (0, r.keyframes)(
          n ||
            (n = (0, a.Z)([
              "\n  0% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-25px);\n  }\n  100% {\n    transform: translateY(0);\n  }\n",
            ])),
        ),
        j = (0, s.Z)("div", {
          target: "e1hbwl4h8",
          label: "BackgroundImages--Wrapper",
        })({
          name: "19s8nj4",
          styles: "position:absolute;width:100%;height:100%",
        }),
        S = (0, s.Z)("div", {
          target: "e1hbwl4h7",
          label: "BackgroundImages--ImageWrapper",
        })(
          "position:absolute;z-index:1;filter:drop-shadow(3px 5px 3px rgba(0, 0, 0, 0.35));",
          f.ai,
          "{display:none;}",
        ),
        O = (0, s.Z)(S, {
          target: "e1hbwl4h6",
          label: "BackgroundImages--Meteoroid1",
        })(
          "top:10%;left:3%;animation:",
          Z,
          " 15s ease-in-out infinite;animation-delay:-5s;",
        ),
        A = (0, s.Z)(S, {
          target: "e1hbwl4h5",
          label: "BackgroundImages--Meteoroid2",
        })(
          "top:15%;left:15%;animation:",
          Z,
          " 15s ease-in-out infinite;animation-delay:1s;",
          f.PJ,
          "{display:none;}",
        ),
        C = (0, s.Z)(S, {
          target: "e1hbwl4h4",
          label: "BackgroundImages--Meteoroid3",
        })(
          "top:10%;left:45%;animation:",
          Z,
          " 10s ease-in-out infinite;animation-delay:-3s;",
          f.Mq,
          "{display:none;}",
        ),
        B = (0, s.Z)(S, {
          target: "e1hbwl4h3",
          label: "BackgroundImages--Meteoroid4",
        })(
          "top:10%;left:65%;animation:",
          Z,
          " 15s ease-in-out infinite;animation-delay:3s;",
          f.PJ,
          "{display:none;}",
        ),
        k = (0, s.Z)(S, {
          target: "e1hbwl4h2",
          label: "BackgroundImages--Meteoroid5",
        })(
          "bottom:15%;left:30%;z-index:0;animation:",
          Z,
          " 10s ease-in-out infinite;animation-delay:-1s;",
        ),
        P = (0, s.Z)(S, {
          target: "e1hbwl4h1",
          label: "BackgroundImages--MeteoroidBig",
        })(
          "top:5%;right:5%;z-index:0;animation:",
          Z,
          " 20s ease-in-out infinite;",
        ),
        I = (0, s.Z)(S, {
          target: "e1hbwl4h0",
          label: "BackgroundImages--Ufo",
        })(
          "bottom:30%;right:3%;animation:",
          Z,
          " 5s ease-in-out infinite;",
          f.Mq,
          "{display:none;}",
        ),
        M = i(59499),
        G = i(50029),
        R = i(87794),
        _ = i.n(R),
        E = i(25543),
        T = i(84811),
        N = i(37824),
        D = i(64803),
        W = i(1364),
        z = i(73540),
        L = i(15555);
      function q(t, e) {
        var i = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(t);
          e &&
            (n = n.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            i.push.apply(i, n);
        }
        return i;
      }
      function U(t) {
        for (var e = 1; e < arguments.length; e++) {
          var i = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? q(Object(i), !0).forEach(function (e) {
                (0, M.Z)(t, e, i[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i))
            : q(Object(i)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(i, e),
                );
              });
        }
        return t;
      }
      var F = function () {
          var t,
            e = (0, D.z)(),
            i = (0, D.i)(function (t) {
              return {
                betAmount: t.game.bet,
                balance: t.user.isAuth
                  ? t.user.balances[t.user.activeCurrency]
                  : 0,
                UIBlocked: t.game.UIBlocked,
              };
            }),
            n = i.betAmount,
            a = i.balance,
            s = i.UIBlocked,
            r = (0, T.m)({
              amount: n,
              setAmount: function (t) {
                return e((0, N.gQ)(t));
              },
              currency: E.qY,
              withColor: !0,
            }),
            o = function (t) {
              return (0, G.Z)(
                _().mark(function i() {
                  return _().wrap(function (i) {
                    for (;;)
                      switch ((i.prev = i.next)) {
                        case 0:
                          return (i.next = 2), e((0, N._F)(t));
                        case 2:
                        case "end":
                          return i.stop();
                      }
                  }, i);
                }),
              );
            };
          return (0, v.jsxs)(Q, {
            children: [
              (0, v.jsx)(
                z.V,
                U(
                  U(
                    {
                      disabled: s,
                    },
                    r,
                  ),
                  {},
                  {
                    placeholder: "Bet Amount",
                  },
                ),
              ),
              (0, v.jsx)(L.X, {
                type: "button",
                onClick: o(2),
                disabled: s,
                colorTheme: "light",
                children: "2x",
              }),
              (0, v.jsx)(L.X, {
                type: "button",
                onClick: o(0.5),
                disabled: s,
                children: "1/2",
              }),
              (0, v.jsx)(W.n, {
                onClick:
                  ((t = a),
                  (0, G.Z)(
                    _().mark(function i() {
                      return _().wrap(function (i) {
                        for (;;)
                          switch ((i.prev = i.next)) {
                            case 0:
                              return (i.next = 2), e((0, N.gQ)(t));
                            case 2:
                            case "end":
                              return i.stop();
                          }
                      }, i);
                    }),
                  )),
                disabled: s,
                small: !0,
              }),
            ],
          });
        },
        Q = (0, s.Z)("div", {
          target: "e9cc1gh0",
          label: "BetAmount--BetAmountWrapper",
        })(
          "display:flex;align-items:stretch;justify-content:space-between;gap:12px;",
          f.ai,
          "{gap:8px;}",
        ),
        X = i(47644),
        H = i(9106),
        V = i(13744),
        Y = i(97356),
        J = i(33021),
        $ = i(45505),
        K = i(35716),
        tt = i(18278);
      var et = function () {
          var t,
            e,
            i = (0, D.z)(),
            n = (0, D.i)(function (t) {
              return {
                autoCashout: t.crashControls.autoCashout,
                currentPlay: t.crash.playerInfo[t.user.name],
                name: t.user.name,
                isButtonDisabled: t.crashBetButton.disabled,
              };
            }),
            a = n.autoCashout,
            s = n.currentPlay,
            r = n.name,
            o = n.isButtonDisabled,
            h = (0, D.i)(function (t) {
              return {
                betAmount: t.game.bet,
                balance: t.user.isAuth
                  ? t.user.balances[t.user.activeCurrency]
                  : 0,
              };
            }).betAmount,
            c = (0, D.i)(function (t) {
              return t.crash;
            }),
            l = c.gameStatus,
            f = c.joined,
            d = c.nextBetAmount,
            p = c.startTime,
            x = c.lastGameTick,
            m = c.lag,
            g = (0, D.i)(function (t) {
              return t.game;
            }),
            y = g.UIBlocked,
            b = g.isAutoBetting,
            w = J.yA(l, s),
            Z = J.tP(r, d, f),
            j = J.jz(p, x, l, m),
            S = J.x8(j),
            O = (function () {
              var t = (0, G.Z)(
                _().mark(function t(e) {
                  return _().wrap(function (t) {
                    for (;;)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (
                            (e.preventDefault(),
                            (0, K.t8)("crash-lock", Math.random().toString()),
                            "STARTING" !== l)
                          ) {
                            t.next = 6;
                            break;
                          }
                          Z || i((0, Y.u1)(h, a, !1)), (t.next = 22);
                          break;
                        case 6:
                          if (!w) {
                            t.next = 14;
                            break;
                          }
                          return (t.next = 9), i((0, Y.Nx)());
                        case 9:
                          if (b) {
                            t.next = 12;
                            break;
                          }
                          return (t.next = 12), i((0, N.Qc)());
                        case 12:
                          t.next = 22;
                          break;
                        case 14:
                          if (!Z) {
                            t.next = 21;
                            break;
                          }
                          if ((i((0, Y.Zj)()), !y)) {
                            t.next = 19;
                            break;
                          }
                          return (t.next = 19), i((0, N.Qc)());
                        case 19:
                          t.next = 22;
                          break;
                        case 21:
                          i((0, Y.u1)(h, a, !1));
                        case 22:
                          i((0, V.Iw)());
                        case 23:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                }),
              );
              return function (e) {
                return t.apply(this, arguments);
              };
            })();
          "STARTING" === l
            ? Z
              ? (t = "Waiting")
              : ((t = "Place bet"), (e = !0))
            : w
            ? ((t = "Cash Out"), (e = !0))
            : Z
            ? (t = "Betting")
            : ((t = "Place bet"), (e = !0));
          var A = h;
          return (
            w && "IN_PROGRESS" === l && (A = s.bet.amount * S),
            (0, v.jsxs)(tt.B, {
              type: "button",
              onClick: O,
              disabled: o || (0 === h && !w),
              children: [
                t,
                e &&
                  (0, v.jsxs)(it, {
                    children: [
                      (0, v.jsx)(u(), {
                        src: H.Z.src,
                        width: 17,
                        height: 18,
                      }),
                      (0, $.EA)({
                        amount: A,
                        currency: X.q,
                      }),
                    ],
                  }),
              ],
            })
          );
        },
        it = (0, s.Z)("div", {
          target: "e34kfa20",
          label: "BetButton--BetAmountWrapper",
        })({
          name: "1jvurm9",
          styles: "display:flex;align-items:center;gap:5px",
        }),
        nt = function () {
          return (0, v.jsxs)(at, {
            children: [
              (0, v.jsx)(st, {
                children: (0, v.jsx)(F, {}),
              }),
              (0, v.jsx)(st, {
                children: (0, v.jsx)(et, {}),
              }),
            ],
          });
        },
        at = (0, s.Z)("div", {
          target: "e3nhqzh1",
          label: "Manual--Wrapper",
        })(
          "display:grid;grid-template:1fr/2fr 1fr;grid-gap:12px;width:100%;height:100%;",
          f.PJ,
          "{grid-template:1fr 1fr/1fr;}",
          f.ai,
          "{grid-gap:8px;}",
        ),
        st = (0, s.Z)("div", {
          target: "e3nhqzh0",
          label: "Manual--Column",
        })(
          "display:grid;grid-template:1fr/1fr;grid-gap:12px;width:100%;height:53px;",
          f.ai,
          "{grid-gap:8px;height:40px;}",
        ),
        rt = function () {
          return (0, v.jsx)(ot, {
            children: (0, v.jsx)(nt, {}),
          });
        },
        ot = (0, s.Z)("div", {
          target: "e1it8rhg0",
          label: "Controls--ControlsWrapper",
        })(
          "width:100%;padding:20px;border-radius:20px;background-color:",
          function (t) {
            return t.theme.colors.secondary;
          },
          ";",
          f.Mq,
          "{padding:10px;}",
        );
      var ht,
        ct,
        lt = function () {
          var t = (0, D.i)(function (t) {
            return t.crash;
          }).tableHistory;
          return (0, v.jsx)(ut, {
            children: t.map(function (t) {
              return (0, v.jsxs)(
                ft,
                {
                  green: t.gameCrash / 100 > 2,
                  children: [t.gameCrash / 100, "x"],
                },
                t.gameId,
              );
            }),
          });
        },
        ut = (0, s.Z)("div", {
          target: "e1xvurq1",
          label: "PreviousGames--Wrapper",
        })({
          name: "1ht1ix4",
          styles:
            "display:flex;justify-content:center;width:100%;margin:0 auto;gap:8px;& :last-child{opacity:0.5;}",
        }),
        ft = (0, s.Z)("div", {
          target: "e1xvurq0",
          label: "PreviousGames--Item",
        })(
          "display:flex;justify-content:center;align-items:center;width:auto;min-width:70px;padding:10px;border-radius:4px;font-family:'Changa',sans-serif;font-size:15px;line-height:15px;font-weight:400;",
          function (t) {
            var e = t.green,
              i = t.theme;
            return e
              ? "background-color: "
                  .concat(
                    i.colors.crash.previousGames.bgGreen,
                    ";\n         color: ",
                  )
                  .concat(i.colors.crash.previousGames.textGreen, ";")
              : "background-color: "
                  .concat(
                    i.colors.crash.previousGames.bgPurple,
                    ";\n        color: ",
                  )
                  .concat(i.colors.crash.previousGames.textPurple, ";");
          },
          " ",
          f.ai,
          "{min-width:unset;padding:10px;}",
        ),
        dt = i(64544),
        pt = "/_next/static/media/infinity-icon.8d8ef4ca.png",
        xt = i(46592),
        mt = i(32751);
      function gt(t, e) {
        var i = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(t);
          e &&
            (n = n.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            i.push.apply(i, n);
        }
        return i;
      }
      var yt = function () {
          var t = (0, D.z)(),
            e = (0, c.useState)([]),
            i = e[0],
            n = e[1],
            a = (0, D.i)(function (t) {
              return {
                playerInfo: t.crash.playerInfo,
              };
            }).playerInfo,
            s = (0, D.i)(function (t) {
              return {
                currentPlay: t.crash.playerInfo[t.user.name],
              };
            }).currentPlay,
            r = (0, D.i)(function (t) {
              return t.crash;
            }),
            o = r.gameStatus,
            h = r.startTime,
            l = r.lastGameTick,
            f = r.lag;
          (0, c.useEffect)(
            function () {
              var t = [];
              Object.keys(a).forEach(function (e) {
                t.push(
                  (function (t) {
                    for (var e = 1; e < arguments.length; e++) {
                      var i = null != arguments[e] ? arguments[e] : {};
                      e % 2
                        ? gt(Object(i), !0).forEach(function (e) {
                            (0, M.Z)(t, e, i[e]);
                          })
                        : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(
                            t,
                            Object.getOwnPropertyDescriptors(i),
                          )
                        : gt(Object(i)).forEach(function (e) {
                            Object.defineProperty(
                              t,
                              e,
                              Object.getOwnPropertyDescriptor(i, e),
                            );
                          });
                    }
                    return t;
                  })(
                    {
                      name: e,
                    },
                    a[e],
                  ),
                );
              }),
                n(t);
            },
            [a],
          );
          var d = J.yA(o, s),
            p = (function () {
              var e = (0, G.Z)(
                _().mark(function e() {
                  return _().wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (!d) {
                            e.next = 3;
                            break;
                          }
                          return (e.next = 3), t((0, Y.Nx)());
                        case 3:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                }),
              );
              return function () {
                return e.apply(this, arguments);
              };
            })(),
            x = J.jz(h, l, o, f),
            m = J.x8(x);
          return (0, v.jsx)(wt, {
            children: i.map(function (t) {
              var e = t.name,
                i = t.avatar,
                n = t.bet,
                a = t.stoppedAt;
              return (0, v.jsxs)(
                Zt,
                {
                  stoppedAt: a,
                  gameStatus: o,
                  children: [
                    (0, v.jsxs)(jt, {
                      children: [
                        i &&
                          (0, v.jsx)(Ot, {
                            children: (0, v.jsx)(u(), {
                              src: i,
                              width: 45,
                              height: 45,
                              alt: "avatar",
                            }),
                          }),
                        (0, v.jsxs)(St, {
                          children: [
                            (0, v.jsx)(At, {
                              children: (0, v.jsx)(mt.v, {
                                displayName: (0, dt.clearUsername)(e),
                              }),
                            }),
                            (0, v.jsxs)(Ct, {
                              gameStatus: o,
                              stoppedAt: a,
                              children: [
                                (0, v.jsx)(u(), {
                                  src: H.Z.src,
                                  width: 17,
                                  height: 18,
                                }),
                                "IN_PROGRESS" !== o || a
                                  ? (0, v.jsx)(Bt, {
                                      children: (0, $.EA)({
                                        amount: a
                                          ? (a * n.amount) / 100
                                          : n.amount,
                                        currency: X.q,
                                      }),
                                    })
                                  : (0, v.jsx)(Bt, {
                                      children: (0, $.EA)({
                                        amount: n.amount * m,
                                        currency: X.q,
                                      }),
                                    }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    "ENDED" === o || a
                      ? (0, v.jsx)(kt, {
                          stoppedAt: a,
                          children: a ? "".concat(a / 100, "X") : "0X",
                        })
                      : (0, v.jsx)(Pt, {
                          onClick: p,
                          disabled: !d,
                          children: (0, v.jsx)(u(), {
                            src: pt,
                            width: 14,
                            height: 7,
                            alt: "infinity",
                          }),
                        }),
                  ],
                },
                e,
              );
            }),
          });
        },
        bt = (0, r.keyframes)(
          ht ||
            (ht = (0, a.Z)([
              "\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n",
            ])),
        ),
        vt = (0, r.keyframes)(
          ct ||
            (ct = (0, a.Z)([
              "\n  from {\n    opacity: 0;\n    margin-left: -100%;\n  }\n  10% {\n    opacity: 1;\n  }\n  to {\n    opacity: 1;\n    margin-left: 0;\n  }\n",
            ])),
        ),
        wt = (0, s.Z)("div", {
          target: "eh62sj9",
          label: "Players--PlayersList",
        })({
          name: "1xc5zxn",
          styles: "display:flex;flex-direction:column;gap:6px",
        }),
        Zt = (0, s.Z)("div", {
          target: "eh62sj8",
          label: "Players--BetWrapper",
        })(
          "display:flex;justify-content:space-between;align-items:center;gap:10px;min-height:65px;padding:10px;border-radius:6px;background-color:",
          function (t) {
            return t.stoppedAt
              ? xt.r.colors.betsGreenBG
              : xt.r.colors.betsPurpleBG;
          },
          ";background-color:",
          function (t) {
            var e = t.gameStatus,
              i = t.stoppedAt;
            return "ENDED" === e && !i && xt.r.colors.betsRedBG;
          },
          ";animation:",
          bt,
          " 0.4s;",
        ),
        jt = (0, s.Z)("div", {
          target: "eh62sj7",
          label: "Players--UserWrapper",
        })(
          "display:flex;align-items:center;gap:10px;animation:",
          vt,
          " 0.4s ease;",
          f.ai,
          "{width:100%;}",
        ),
        St = (0, s.Z)("div", {
          target: "eh62sj6",
          label: "Players--UserInnerWrapper",
        })({
          name: "i3vnpq",
          styles:
            "display:flex;flex-direction:column;justify-content:center;align-items:start;gap:6px",
        }),
        Ot = (0, s.Z)("div", {
          target: "eh62sj5",
          label: "Players--UserIcon",
        })({
          name: "s5xdrg",
          styles: "display:flex;align-items:center",
        }),
        At = (0, s.Z)("div", {
          target: "eh62sj4",
          label: "Players--UserName",
        })({
          name: "sm5734",
          styles:
            "width:fit-content;max-width:125px;overflow:hidden;color:#ffffff",
        }),
        Ct = (0, s.Z)("div", {
          target: "eh62sj3",
          label: "Players--CashWrapper",
        })(
          "display:flex;align-items:center;gap:5px;color:",
          xt.r.colors.manatee,
          ";color:",
          function (t) {
            return t.stoppedAt && xt.r.colors.controlsQuaternary;
          },
          ";color:",
          function (t) {
            var e = t.gameStatus,
              i = t.stoppedAt;
            return "ENDED" === e && !i && xt.r.colors.controlsQuinary;
          },
          ";",
        ),
        Bt = (0, s.Z)("p", {
          target: "eh62sj2",
          label: "Players--Cash",
        })(
          "margin:0;font-size:15px;line-height:15px;font-family:'Changa',sans-serif;font-weight:900;color:",
          xt.r.colors.manatee,
          ";",
        ),
        kt = (0, s.Z)("div", {
          target: "eh62sj1",
          label: "Players--Profit",
        })(
          "display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;max-width:52px;min-height:30px;padding:8px 0;border-radius:6px;font-weight:600;font-size:13px;line-height:13px;text-align:center;background-color:",
          function (t) {
            return t.stoppedAt
              ? xt.r.colors.controlsQuaternary
              : xt.r.colors.controlsQuinary;
          },
          ";",
        ),
        Pt = (0, s.Z)("button", {
          target: "eh62sj0",
          label: "Players--CashoutButton",
        })(
          "display:flex;flex-direction:column;justify-content:center;align-items:center;width:100%;max-width:52px;min-height:30px;border-radius:6px;padding:8px 0;background-color:",
          xt.r.colors.controlsTertiary,
          ";",
        );
      var It = function () {
          var t = (0, D.i)(function (t) {
              return t.crash;
            }),
            e = t.joined,
            i = t.playerInfo,
            n = e.map(function (t) {
              return i[t].bet.amount;
            }),
            a = n.length
              ? n.reduce(function (t, e) {
                  return e + t;
                })
              : 0;
          return (0, v.jsxs)(Mt, {
            children: [
              (0, v.jsxs)(Rt, {
                children: [
                  (0, v.jsx)(u(), {
                    src: H.Z.src,
                    width: 17,
                    height: 18,
                  }),
                  (0, $.EA)({
                    amount: a,
                    currency: E.qY,
                  }),
                ],
              }),
              (0, v.jsx)(Gt, {
                children: e.length,
              }),
            ],
          });
        },
        Mt = (0, s.Z)("div", {
          target: "e1heipfb2",
          label: "TotalInfo--Wrapper",
        })({
          name: "1066lcq",
          styles:
            "display:flex;justify-content:space-between;align-items:center",
        }),
        Gt = (0, s.Z)("div", {
          target: "e1heipfb1",
          label: "TotalInfo--UsersInfo",
        })({
          name: "nr9zrs",
          styles:
            "height:100%;display:flex;align-items:center;gap:10px;font-family:'Changa',sans-serif;font-size:15px;line-height:15px;&::before{content:'';height:5px;width:5px;outline:4px solid rgba(255, 255, 255, 0.19);border-radius:100%;background-color:#ffffff;}",
        }),
        Rt = (0, s.Z)(Gt, {
          target: "e1heipfb0",
          label: "TotalInfo--AmountInfo",
        })({
          name: "tnrtc7",
          styles: "gap:5px;&::before{display:none;}",
        }),
        _t = function () {
          return (0, v.jsxs)(Et, {
            children: [(0, v.jsx)(It, {}), (0, v.jsx)(yt, {})],
          });
        },
        Et = (0, s.Z)("div", {
          target: "eifntk50",
          label: "RightSidebar--Wrapper",
        })(
          "z-index:1;grid-row-start:2;display:flex;flex-direction:column;gap:15px;width:100%;height:fit-content;min-height:400px;padding:15px;border-radius:22px;background-color:",
          function (t) {
            return t.theme.colors.tertiary;
          },
          ";",
          f.ai,
          "{grid-row-start:unset;}",
        ),
        Tt = i(92777),
        Nt = i(82262),
        Dt = i(10748),
        Wt = i(45959),
        zt = i(63553),
        Lt = i(37247),
        qt = i(22699),
        Ut = i(56219),
        Ft = i(69577),
        Qt = i(39242);
      function Xt(t) {
        var e = (function t(e) {
            var i = {};
            return (
              Object.keys(e).forEach(function (n) {
                e[n] && "object" === typeof e[n]
                  ? (i[n] = t(e[n]))
                  : (i[n] = e[n]);
              }),
              i
            );
          })(t),
          i = Object.values(e);
        return (
          E.pG.forEach(function (t) {
            for (
              var e = i
                  .filter(function (e) {
                    return e.bet.currency === t;
                  })
                  .sort(function (t, e) {
                    return e.stoppedAt - t.stoppedAt;
                  }),
                n = 0,
                a = 0,
                s = 0;
              s < e.length;
              ++s
            ) {
              var r = e[s].bet;
              (n += r.amount / 100), (a = Math.max(a, r.amount));
            }
            var o = n / a;
            !(function (t, e) {
              for (var i = 0; i < t.length; ) {
                for (
                  var n = [], a = 0, s = t[i].stoppedAt;
                  i < t.length && t[i].stoppedAt === s;
                  ++i
                )
                  (a += t[i].bet.amount), n.push(i);
                e(t, n, s, a);
              }
            })(e, function (t, e, i, a) {
              if (n <= 0) for (var s = 0; s < e.length; s++) t[e[s]].bonus = 0;
              else
                for (var r = Math.min(a * o, n), h = 0; h < e.length; h++) {
                  var c = (t[e[h]].bet.amount / a) * r;
                  (n -= c), (t[e[h]].bonus = c);
                }
            });
          }),
          e
        );
      }
      var Ht = i(25668),
        Vt = i(90829),
        Yt = i(89835),
        Jt = i(66906),
        $t = i(14602),
        Kt = i(15202),
        te = i(17498),
        ee = i(26567),
        ie = {
          src: "/_next/static/media/Prime.d42ab5e2.svg",
          height: 19,
          width: 22,
        },
        ne = "/_next/static/media/busted.e3c07147.svg",
        ae = "/_next/static/media/graph-bg.842e734b.png",
        se = "/_next/static/media/rocket.45f8e8ae.png",
        re = "/_next/static/media/rocketSm.4465ede0.png";
      function oe(t, e) {
        var i =
          ("undefined" !== typeof Symbol && t[Symbol.iterator]) ||
          t["@@iterator"];
        if (!i) {
          if (
            Array.isArray(t) ||
            (i = (function (t, e) {
              if (!t) return;
              if ("string" === typeof t) return he(t, e);
              var i = Object.prototype.toString.call(t).slice(8, -1);
              "Object" === i && t.constructor && (i = t.constructor.name);
              if ("Map" === i || "Set" === i) return Array.from(t);
              if (
                "Arguments" === i ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)
              )
                return he(t, e);
            })(t)) ||
            (e && t && "number" === typeof t.length)
          ) {
            i && (t = i);
            var n = 0,
              a = function () {};
            return {
              s: a,
              n: function () {
                return n >= t.length
                  ? {
                      done: !0,
                    }
                  : {
                      done: !1,
                      value: t[n++],
                    };
              },
              e: function (t) {
                throw t;
              },
              f: a,
            };
          }
          throw new TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
          );
        }
        var s,
          r = !0,
          o = !1;
        return {
          s: function () {
            i = i.call(t);
          },
          n: function () {
            var t = i.next();
            return (r = t.done), t;
          },
          e: function (t) {
            (o = !0), (s = t);
          },
          f: function () {
            try {
              r || null == i.return || i.return();
            } finally {
              if (o) throw s;
            }
          },
        };
      }
      function he(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var i = 0, n = new Array(e); i < e; i++) n[i] = t[i];
        return n;
      }
      var ce,
        le = (function () {
          function t() {
            var e = this;
            (0, Tt.Z)(this, t),
              (0, M.Z)(this, "rendering", !1),
              (0, M.Z)(this, "animRequest", null),
              (0, M.Z)(this, "ctx", void 0),
              (0, M.Z)(this, "canvas", void 0),
              (0, M.Z)(this, "cashedOut", []),
              (0, M.Z)(this, "maxStep", 10),
              (0, M.Z)(this, "showCurrency", void 0),
              (0, M.Z)(this, "style", {
                plot: {
                  bgColor: "#1a2245",
                  font: "500 115px Changa",
                },
                axis: {
                  font: "500 12px Changa",
                  fontSmall: "500 10px Changa",
                  color: "#6f7ba5",
                  mutedColor: "#6f7ba525",
                },
              }),
              (0, M.Z)(this, "w", void 0),
              (0, M.Z)(this, "h", void 0),
              (0, M.Z)(this, "plot", {
                w: null,
                h: null,
                offset: {
                  x: 50,
                  y: 50,
                },
              }),
              (0, M.Z)(this, "milisecondsSeparation", void 0),
              (0, M.Z)(this, "XAxisValuesSeparation", void 0),
              (0, M.Z)(this, "y", {
                dash: {
                  w: 7,
                  h: 2,
                },
                w: 0,
                min: 1,
                max: 2,
                endpointMax: 2,
                initialMax: 4,
                value: 0,
                offset: 25,
                scale: null,
              }),
              (0, M.Z)(this, "x", {
                dash: {
                  w: 2,
                  h: 7,
                },
                h: 0,
                min: 0,
                max: 9e3,
                endpointMax: 2,
                initialMax: 9e3,
                value: 0,
                offset: 25,
                scale: null,
              }),
              (0, M.Z)(this, "cashedOutPoints", {
                textColor: function (t) {
                  return "rgba(51,93,207,".concat(t, ")");
                },
              }),
              (0, M.Z)(this, "primeImg", void 0),
              (0, M.Z)(this, "rcBagImg", void 0),
              (0, M.Z)(this, "images", new Map()),
              (0, M.Z)(this, "getParentNodeFunc", function () {
                return null;
              }),
              (0, M.Z)(this, "resize", function () {
                e.getParentNodeFunc &&
                  ((e.w = e.canvas.width),
                  (e.h = e.canvas.height),
                  (e.canvas.width = e.canvas.clientWidth),
                  (e.canvas.height = e.canvas.clientHeight),
                  e.configPlotSettings());
              });
          }
          return (
            (0, Nt.Z)(t, [
              {
                key: "drawImage",
                value: function (t) {
                  if (!this.images.has(t)) {
                    var e = new Image();
                    (e.src = t), this.images.set(t, e);
                  }
                  return this.images.get(t);
                },
              },
              {
                key: "startRendering",
                value: function (t) {
                  var e = this;
                  if (!t.getContext) return console.error("No canvas");
                  (this.rendering = !0),
                    (this.canvas = t),
                    (this.ctx = t.getContext("2d")),
                    (this.w = this.canvas.width),
                    (this.h = this.canvas.height),
                    (this.canvas.width = this.canvas.clientWidth),
                    (this.canvas.height = this.canvas.clientHeight),
                    (this.ctx.fillStyle = this.style.plot.bgColor),
                    (this.ctx.textBaseline = "middle"),
                    (this.ctx.textAlign = "center"),
                    ee.S &&
                      ((this.primeImg = new Image()),
                      (this.primeImg.src =
                        null === ie || void 0 === ie ? void 0 : ie.src)),
                    (this.showCurrency = !1),
                    this.configPlotSettings(),
                    (this.animRequest = window.requestAnimationFrame(
                      function () {
                        return e.render();
                      },
                    ));
                },
              },
              {
                key: "configPlotSettings",
                value: function () {
                  (this.ctx.lineJoin = "round"),
                    (this.plot.w = this.w - this.plot.offset.x),
                    (this.plot.h = this.h - this.plot.offset.y);
                },
              },
              {
                key: "handleCashOut",
                value: function (t, e, i) {
                  this.cashedOut.push({
                    cashedOutAt: t,
                    currency: e,
                    avatar: i,
                    step: 0,
                  });
                },
              },
              {
                key: "endGame",
                value: function () {
                  this.cashedOut = [];
                },
              },
              {
                key: "stopRendering",
                value: function () {
                  this.rendering = !1;
                },
              },
              {
                key: "render",
                value: function () {
                  var t = this;
                  this.rendering &&
                    (this.calcGameData(),
                    this.calculatePlotValues(),
                    this.clean(),
                    this.drawAxes(),
                    this.drawGameData(),
                    this.drawGraph(),
                    this.drawCashedOut(),
                    (this.animRequest = window.requestAnimationFrame(
                      function () {
                        return t.render();
                      },
                    )));
                },
              },
              {
                key: "calcGameData",
                value: function () {
                  var t = Vt.h.getState().crash,
                    e = t.startTime,
                    i = t.lag,
                    n = t.lastGameTick,
                    a = t.gameStatus;
                  (this.x.value = (0, J.jz)(e, n, a, i)),
                    (this.y.value = (0, J.x8)(this.x.value));
                },
              },
              {
                key: "calculatePlotValues",
                value: function () {
                  (this.x.max = Math.max(this.x.value, this.x.initialMax)),
                    (this.y.max = Math.max(this.y.value, this.y.initialMax)),
                    (this.x.endpointMax = 1.1 * this.x.max),
                    (this.y.endpointMax = 1.3 * this.y.max),
                    (this.x.scale =
                      this.plot.w / (this.x.endpointMax - this.x.min)),
                    (this.y.scale =
                      this.plot.h / (this.y.endpointMax - this.y.min));
                },
              },
              {
                key: "clean",
                value: function () {
                  (this.ctx.fillStyle = this.style.plot.bgColor),
                    this.ctx.fillRect(
                      0,
                      0,
                      this.canvas.width,
                      this.canvas.height,
                    );
                  var t = this.drawImage(ae);
                  this.ctx.drawImage(t, 0, 0);
                },
              },
              {
                key: "rotate",
                value: function (t, e, i) {
                  return [
                    Math.cos(t) * e - Math.sin(t) * i,
                    Math.sin(t) * e + Math.cos(t) * i,
                  ];
                },
              },
              {
                key: "drawRocket",
                value: function (t, e, i) {
                  var n = Vt.h.getState().device.mobile
                    ? this.drawImage(re)
                    : this.drawImage(se);
                  this.ctx.save(),
                    this.ctx.translate(e, i),
                    this.ctx.rotate(t),
                    this.ctx.translate(-e, -i),
                    this.ctx.drawImage(
                      n,
                      e - 0.9 * n.width,
                      i - (n.height / 2) * 0.95,
                    ),
                    this.ctx.restore();
                },
              },
              {
                key: "drawBusted",
                value: function (t, e) {
                  var i = this.drawImage(ne);
                  this.ctx.drawImage(i, t, e);
                },
              },
              {
                key: "drawGraph",
                value: function () {
                  var t = Vt.h.getState().device.mobile,
                    e = Vt.h.getState().crash.gameStatus,
                    i = this.x.max;
                  if (!(this.x.value < 10)) {
                    this.ctx.lineCap = "round";
                    var n = this.ctx.createLinearGradient(0, 0, this.w, this.h);
                    "IN_PROGRESS" === e
                      ? Number(this.y.value.toFixed(2)) <= 50
                        ? (n.addColorStop(0, "#7588df"),
                          n.addColorStop(1, "#548eef"))
                        : (n.addColorStop(0, "#ffac33"),
                          n.addColorStop(1, "#ffc571"))
                      : (n.addColorStop(0, "#9b4b58"),
                        n.addColorStop(1, "#ef7070")),
                      (this.ctx.strokeStyle = n),
                      (this.ctx.lineWidth = t ? 4 : 8),
                      this.ctx.beginPath(),
                      this.ctx.moveTo(
                        this.plot.offset.x + this.y.w,
                        this.plot.h - this.x.h,
                      );
                    for (
                      var a,
                        s,
                        r,
                        o,
                        h,
                        c,
                        l = 1e3 - (5 * Math.min(this.x.value, 1e4)) / 100,
                        u = 1;
                      u <= l;
                      u++
                    ) {
                      var f = ((i + 100) * u) / l;
                      if (f > this.x.value + 100) break;
                      var d = f * this.x.scale,
                        p = ((0, J.x8)(f) - 1) * this.y.scale;
                      (a = r),
                        (s = o),
                        (r = d + this.plot.offset.x + this.y.w),
                        (o = this.plot.h - p - this.x.h),
                        this.ctx.lineTo(
                          d + this.plot.offset.x + this.y.w,
                          this.plot.h - p - this.x.h,
                        ),
                        (h = d + this.plot.offset.x + this.y.w),
                        (c = this.plot.h - p - this.x.h);
                    }
                    this.ctx.stroke(),
                      (this.ctx.fillStyle = "#3a3a5d"),
                      this.ctx.fillRect(
                        this.plot.offset.x - 6,
                        this.plot.h - 6,
                        12,
                        12,
                      ),
                      "IN_PROGRESS" === e
                        ? Number(this.y.value.toFixed(2)) <= 50
                          ? (this.ctx.fillStyle = "#7588df")
                          : (this.ctx.fillStyle = "#ffac33")
                        : (this.ctx.fillStyle = "#9b4b58"),
                      this.ctx.fillRect(
                        this.plot.offset.x - 3,
                        this.plot.h - 3,
                        6,
                        6,
                      );
                    var x = Math.atan((o - s) / (r - a));
                    "IN_PROGRESS" === e
                      ? this.drawRocket(x, h, c)
                      : this.drawBusted(h - 30, c - 30);
                  }
                },
              },
              {
                key: "drawAxes",
                value: function () {
                  if ("IN_PROGRESS" === Vt.h.getState().crash.gameStatus) {
                    var t = (function (t) {
                      var e = 1;
                      if (t > 10) {
                        var i = Math.ceil(Math.log10(t)),
                          n = Math.pow(10, i);
                        e = t > n / 2 ? Math.floor(n / 10) : Math.floor(n / 20);
                      }
                      return e / 8;
                    })(this.y.value ? this.y.value : 1);
                    (this.ctx.textAlign = "center"),
                      (this.ctx.textBaseline = "middle");
                    for (
                      var e = 0;
                      1 + e * t < 0.999 * this.y.endpointMax;
                      e++
                    ) {
                      var i = e * t > 5 ? e * t : 1 + e * t,
                        n = this.plot.h - (i - this.y.min) * this.y.scale;
                      e % 8 === 0
                        ? ((this.ctx.fillStyle = this.style.axis.color),
                          (this.ctx.font = this.style.axis.font),
                          this.ctx.fillText(
                            "".concat(i, "x"),
                            this.y.offset + this.y.dash.w / 2,
                            n,
                          ))
                        : e % 4 === 0
                        ? ((this.ctx.fillStyle = this.style.axis.mutedColor),
                          (this.ctx.font = this.style.axis.fontSmall),
                          this.ctx.fillText(
                            "".concat(i < 2 ? i.toFixed(1) : i, "x"),
                            this.y.offset + this.y.dash.w / 2,
                            n,
                          ))
                        : ((this.ctx.fillStyle = this.style.axis.mutedColor),
                          this.ctx.fillRect(
                            this.y.offset,
                            n - this.y.dash.h / 2,
                            this.y.dash.w,
                            this.y.dash.h,
                          ));
                    }
                    (this.milisecondsSeparation = (function (t) {
                      for (var e = 0.4, i = 0.1, n = !0; t >= e; )
                        (e *= n ? 5 : 2), (i *= n ? 2 : 5), (n = !n);
                      return i <= 1e3 ? 1e3 : i;
                    })(this.x.value ? this.x.value : 1)),
                      (this.XAxisValuesSeparation = this.plot.w / this.x.max),
                      (this.ctx.textAlign = "center"),
                      (this.ctx.textBaseline = "middle"),
                      (this.ctx.fillStyle = this.style.axis.color),
                      (this.ctx.font = this.style.axis.font),
                      (this.ctx.font = this.style.axis.font),
                      this.ctx.fillText(
                        "0s",
                        this.plot.offset.x,
                        this.canvas.height - this.x.offset - this.x.dash.h / 2,
                      );
                    for (
                      var a = 0;
                      a < this.x.max;
                      a += this.milisecondsSeparation / 8
                    ) {
                      var s =
                        a * this.XAxisValuesSeparation + this.plot.offset.x;
                      (this.ctx.fillStyle = this.style.axis.mutedColor),
                        (a / 2) % 1e3 !== 0 &&
                          this.ctx.fillRect(
                            s,
                            this.canvas.height - this.x.offset - this.x.dash.h,
                            this.x.dash.w,
                            this.x.dash.h,
                          );
                    }
                    for (
                      var r = this.milisecondsSeparation;
                      r < this.x.max;
                      r += this.milisecondsSeparation
                    ) {
                      var o = String(r / 1e3),
                        h = r * this.XAxisValuesSeparation + this.plot.offset.x;
                      (this.ctx.font = this.style.axis.font),
                        (this.ctx.fillStyle = this.style.axis.color),
                        this.ctx.fillText(
                          "".concat(o, "s"),
                          h,
                          this.canvas.height -
                            this.x.offset -
                            this.x.dash.h / 2,
                        );
                    }
                    (this.ctx.fillStyle = this.style.axis.color),
                      (this.ctx.lineCap = "butt"),
                      (this.ctx.lineWidth = this.y.w),
                      this.ctx.fillRect(
                        this.plot.offset.x,
                        0,
                        this.y.w,
                        this.plot.h,
                      ),
                      (this.ctx.lineWidth = this.x.h),
                      this.ctx.fillRect(
                        this.plot.offset.x,
                        this.plot.h - this.x.h,
                        this.plot.w,
                        this.x.h,
                      );
                  }
                },
              },
              {
                key: "drawCashedOut",
                value: function () {
                  (this.ctx.textAlign = "center"),
                    (this.ctx.textBaseline = "middle");
                  var t,
                    e = oe(this.cashedOut);
                  try {
                    for (e.s(); !(t = e.n()).done; ) {
                      var i = t.value,
                        n = (0, J.A3)(i.cashedOutAt),
                        a =
                          this.h -
                          (i.cashedOutAt / 100 - 1) * this.y.scale -
                          this.plot.offset.y,
                        s = n * this.x.scale + this.plot.offset.x;
                      (this.ctx.font = "400 15px Changa"),
                        (this.ctx.fillStyle = "#00ff8a"),
                        this.ctx.fillText(
                          "".concat((i.cashedOutAt / 100).toFixed(2), "x"),
                          s,
                          a - 60 + i.step,
                        );
                      var r = this.drawImage(i.avatar);
                      this.ctx.drawImage(
                        r,
                        s - 18,
                        a - 38 + i.step - this.maxStep,
                        38,
                        38,
                      ),
                        (i.step = Math.min(i.step + 1, this.maxStep));
                    }
                  } catch (o) {
                    e.e(o);
                  } finally {
                    e.f();
                  }
                },
              },
              {
                key: "drawRCCashedOut",
                value: function (t, e, i) {
                  var n = 42795 / 495.6;
                  this.ctx.drawImage(
                    this.rcBagImg,
                    e - 75,
                    i - 0.75 * n + t.step - this.maxStep,
                    150,
                    n,
                  );
                },
              },
              {
                key: "drawGameData",
                value: function () {
                  this.ctx.save();
                  var t = Vt.h.getState(),
                    e = t.crash,
                    i = e.gameStatus,
                    n = e.playerInfo,
                    a = e.startTime,
                    s = t.user.name,
                    r = t.device.mobile;
                  if (
                    (("IN_PROGRESS" !== i && "ENDED" !== i) ||
                      ((0, J.yA)(i, n[s]) || !n[s]
                        ? (this.ctx.fillStyle = "#ffffff")
                        : (this.ctx.fillStyle = "#0fba75"),
                      (this.ctx.fillStyle =
                        Number(this.y.value.toFixed(2)) >= 50
                          ? "#ffc571ff"
                          : "#ffffff"),
                      (this.ctx.font = r
                        ? "700 50px Changa"
                        : "900 96px Changa"),
                      (this.ctx.textBaseline = "bottom"),
                      (this.ctx.shadowColor = "rgba(0, 0, 0, 0.27)"),
                      (this.ctx.shadowOffsetX = 2),
                      (this.ctx.shadowOffsetY = 6),
                      this.ctx.fillText(
                        "".concat(this.y.value.toFixed(2), "x"),
                        this.w / 2,
                        this.h / 2,
                      )),
                    "ENDED" === i &&
                      ((this.ctx.fillStyle = "#9b4b5840"),
                      this.ctx.fillRect(0, 0, this.w, this.h),
                      (this.ctx.font = r
                        ? "700 20px Changa"
                        : "900 40px Changa"),
                      (this.ctx.fillStyle = "#ef7070"),
                      this.ctx.fillText(
                        "Crashed at",
                        this.w / 2,
                        this.h / 2 - 100,
                      )),
                    "STARTING" === i)
                  ) {
                    (this.ctx.font = r ? "700 25px Changa" : "900 50px Changa"),
                      (this.ctx.fillStyle = "#ffffff"),
                      (this.ctx.textBaseline = "bottom"),
                      (this.ctx.shadowColor = "rgba(0, 0, 0, 0.27)"),
                      (this.ctx.shadowOffsetX = 2),
                      (this.ctx.shadowOffsetY = 6);
                    var o = (Math.max(a - Date.now(), 0) / 1e3).toFixed(1);
                    this.ctx.fillText(
                      "Next round in ".concat("-" === o[0] ? 0 : o, "s"),
                      this.w / 2,
                      this.h / 2,
                    );
                  }
                  this.ctx.restore();
                },
              },
            ]),
            t
          );
        })(),
        ue = new le();
      function fe(t) {
        var e = (function () {
          if ("undefined" === typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" === typeof Proxy) return !0;
          try {
            return (
              Boolean.prototype.valueOf.call(
                Reflect.construct(Boolean, [], function () {}),
              ),
              !0
            );
          } catch (t) {
            return !1;
          }
        })();
        return function () {
          var i,
            n = (0, Lt.Z)(t);
          if (e) {
            var a = (0, Lt.Z)(this).constructor;
            i = Reflect.construct(n, arguments, a);
          } else i = n.apply(this, arguments);
          return (0, zt.Z)(this, i);
        };
      }
      var de,
        pe = (function (t) {
          (0, Wt.Z)(i, t);
          var e = fe(i);
          function i() {
            var t;
            (0, Tt.Z)(this, i);
            for (var n = arguments.length, a = new Array(n), s = 0; s < n; s++)
              a[s] = arguments[s];
            return (
              (t = e.call.apply(e, [this].concat(a))),
              (0, M.Z)((0, Dt.Z)(t), "name", "CRASH"),
              (0, M.Z)((0, Dt.Z)(t), "autoModeState", null),
              (0, M.Z)((0, Dt.Z)(t), "startCurrency", null),
              (0, M.Z)((0, Dt.Z)(t), "startBetAmount", 50),
              (0, M.Z)((0, Dt.Z)(t), "betAmount", 50),
              (0, M.Z)((0, Dt.Z)(t), "currentBetAmount", 50),
              (0, M.Z)((0, Dt.Z)(t), "targetCoef", 200),
              (0, M.Z)((0, Dt.Z)(t), "wonBetMultiplier", 100),
              (0, M.Z)((0, Dt.Z)(t), "dropBetOnWin", !1),
              (0, M.Z)((0, Dt.Z)(t), "looseBetMultiplier", 100),
              (0, M.Z)((0, Dt.Z)(t), "dropBetOnLoose", !1),
              (0, M.Z)((0, Dt.Z)(t), "stopOnWon", 100),
              (0, M.Z)((0, Dt.Z)(t), "stopOnLoose", 100),
              (0, M.Z)((0, Dt.Z)(t), "profit", 0),
              (0, M.Z)((0, Dt.Z)(t), "autoBetsLeft", 1),
              (0, M.Z)((0, Dt.Z)(t), "isCashedOut", !1),
              (0, M.Z)((0, Dt.Z)(t), "onGameStarted", function (t) {
                var e = {};
                for (var i in t)
                  e[i] = {
                    bet: t[i],
                    name: i,
                    displayName: t[i].displayName,
                    avatar: t[i].avatar,
                  };
                var n = Xt(e);
                Vt.h.dispatch((0, Y.t)(n));
              }),
              (0, M.Z)((0, Dt.Z)(t), "onGameTick", function (t) {
                var e = Date.now(),
                  i = Vt.h.getState().crash,
                  n = i.lag,
                  a = i.startTime,
                  s = i.nyan;
                Vt.h.dispatch((0, Y.JV)(e)),
                  !0 === n && Vt.h.dispatch((0, Y.yh)(!1));
                var r = e - t;
                a > r && Vt.h.dispatch((0, Y.qv)(r)),
                  ce && clearTimeout(ce),
                  (ce = setTimeout(function () {
                    return Vt.h.dispatch((0, Y.yh)(!0));
                  }, Qt.Br)),
                  t > Qt.QE && !s && Vt.h.dispatch((0, Y.qz)(!0));
              }),
              (0, M.Z)((0, Dt.Z)(t), "onGameStarting", function (e) {
                Vt.h.dispatch((0, Y._7)(e));
                var i = Vt.h.getState(),
                  n = i.crash,
                  a = n.nextBetAmount,
                  s = n.nextAutoCashout,
                  r = n.nextBetCurrency,
                  o = i.game.isAutoBetting;
                "number" === typeof a &&
                  (Vt.h.dispatch(
                    (0, Y.pF)({
                      currency: r,
                      amount: a,
                      autoCashout: s,
                      isAuto: o,
                    }),
                  ),
                  "betting" === t.autoModeState && (t.profit -= a));
              }),
              (0, M.Z)((0, Dt.Z)(t), "onPlayerBet", function (t) {
                Vt.h.getState().user.name === t.name &&
                  (Vt.h.dispatch((0, N.sB)(!0)),
                  Vt.h.dispatch((0, Y.Zj)()),
                  Vt.h.dispatch((0, Y.GW)(t.bet.amount)),
                  Vt.h.dispatch((0, N.Q$)())),
                  Vt.h.dispatch((0, Y.qP)(t));
              }),
              (0, M.Z)((0, Dt.Z)(t), "onCashOut", function (e) {
                var i = Vt.h.getState(),
                  n = i.crash.playerInfo,
                  a = i.user.email;
                if (!n[e.name])
                  return console.warn(
                    "Username not found in playerInfo at cashed_out: ",
                    e.name,
                  );
                ue.handleCashOut(e.stoppedAt, n[e.name].bet.currency, e.avatar),
                  Vt.h.dispatch((0, Y.T8)(e)),
                  a === e.name &&
                    (Vt.h.dispatch((0, N.sB)(!1)),
                    Vt.h.dispatch((0, Y.Ic)()),
                    "betting" !== t.autoModeState &&
                      Vt.h.dispatch((0, N.eo)()));
                var s = Xt(n);
                Vt.h.dispatch((0, Y.Zl)(s));
              }),
              (0, M.Z)((0, Dt.Z)(t), "onGameCrash", function (e) {
                ce && (clearTimeout(ce), (ce = null));
                var i = Vt.h.getState(),
                  n = i.crash,
                  a = n.playerInfo,
                  s = n.created,
                  r = n.gameId,
                  o = i.user,
                  h = o.name,
                  c = o.balances,
                  l = a[h];
                0 === e.gameCrash && Vt.h.dispatch((0, Y.JK)());
                var u = {};
                for (var f in e.bonuses)
                  if (a[f]) {
                    if (
                      ((u[f] = {
                        bet: a[f].bet,
                        bonus: e.bonuses[f],
                        stoppedAt: a[f].stoppedAt,
                        name: f,
                      }),
                      l && h === f)
                    ) {
                      var d = l.bet.currency,
                        p = e.bonuses[f],
                        x = c[d];
                      console.assert(x > 0 && p > 0);
                    }
                  } else
                    console.error(
                      new Error("User was not found in playerInfo"),
                    );
                t.autoModeState
                  ? t.autoHandleCrash()
                  : Vt.h.dispatch((0, N.eo)()),
                  Vt.h.dispatch(
                    (0, Y.Hf)({
                      created: s,
                      gameId: r,
                      ended: !0,
                      gameCrash: e.gameCrash,
                      hash: e.hash,
                      playerInfo: a,
                    }),
                  ),
                  Vt.h.dispatch((0, N.sB)(!1)),
                  ue.endGame();
              }),
              (0, M.Z)((0, Dt.Z)(t), "join", function () {
                Ht.Z.emit(
                  "join",
                  {
                    time: +Date.now(),
                    isMobileByAgent: (0, Yt.M)(),
                    isMobileByScreen: (0, Ft.ai)(Vt.h.getState().device.width),
                  },
                  function (t, e) {
                    if ("ACCOUNT_DUPLICATE" === (0, te.$)(t))
                      return (
                        Vt.h.dispatch((0, Y.IT)()),
                        Jt.Rt.error(
                          "Error when joining the game...",
                          "The game is opened already somewhere. Please play there only.",
                        )
                      );
                    if (t)
                      return Jt.Rt.error(
                        "Error when joining the game...",
                        (0, te.$)(t),
                      );
                    var i = {
                      gameStatus: e.status,
                      playerInfo: e.playerInfo,
                      gameId: e.gameId,
                      maxWin: e.maxWin,
                      maxBet: e.maxBet,
                      lastHash: e.lastHash,
                      created: e.created,
                      startTime: +new Date(Date.now() - e.elapsed),
                      joined: e.joined,
                      tableHistory: e.tableHistory.slice(0, 6),
                      lastGameTick:
                        "IN_PROGRESS" === e.status ? Date.now() : null,
                    };
                    if (
                      (Vt.h.dispatch((0, Y.rg)(i)),
                      Vt.h.dispatch((0, Y.Su)()),
                      "IN_PROGRESS" === e.status || "ENDED" === e.status)
                    ) {
                      var n = Xt(e.playerInfo);
                      Vt.h.dispatch((0, Y.Zl)(n));
                    }
                  },
                );
              }),
              (0, M.Z)((0, Dt.Z)(t), "onUpdate", function () {
                alert(
                  "Please refresh your browser! We just pushed a new update to the server!",
                );
              }),
              t
            );
          }
          return (
            (0, Nt.Z)(i, [
              {
                key: "startAutoBetting",
                value: function (t) {
                  var e = Vt.h.getState().crash.gameStatus;
                  (this.autoModeState =
                    "IN_PROGRESS" === e ? "requested" : "betting"),
                    (this.startCurrency = t.startCurrency),
                    (this.startBetAmount = t.betAmount),
                    (this.betAmount = t.betAmount),
                    (this.autoBetsLeft = t.betsNumber || 1 / 0),
                    (this.targetCoef = t.targetCoef),
                    (this.wonBetMultiplier = t.wonBetMultiplier),
                    (this.dropBetOnWin = t.dropBetOnWin),
                    (this.looseBetMultiplier = t.looseBetMultiplier),
                    (this.dropBetOnLoose = t.dropBetOnLoose),
                    (this.stopOnWon = t.stopOnWon),
                    (this.stopOnLoose = t.stopOnLoose),
                    Vt.h.dispatch((0, N.sB)(!0)),
                    Vt.h.dispatch((0, N.Q$)()),
                    "STARTING" === e
                      ? ((this.profit = -this.betAmount),
                        Vt.h.dispatch(
                          (0, Y.pF)({
                            currency: this.startCurrency,
                            amount: this.betAmount,
                            autoCashout: this.targetCoef,
                            isAuto: !0,
                          }),
                        ))
                      : Vt.h.dispatch(
                          (0, Y.MY)({
                            currency: this.startCurrency,
                            betAmount: this.betAmount,
                            autoCashout: this.targetCoef,
                            isAuto: !0,
                          }),
                        );
                },
              },
              {
                key: "endAutoBetting",
                value: function () {
                  (this.autoModeState = null),
                    Vt.h.dispatch((0, N.sB)(!1)),
                    this.emit("auto:end"),
                    Vt.h.dispatch((0, N.eo)()),
                    Vt.h.dispatch((0, N.Dr)());
                },
              },
              {
                key: "autoCashedOut",
                value: function (t) {
                  (this.isCashedOut = !0),
                    (this.profit += t),
                    this.emit("auto:cashout", this.profit);
                },
              },
              {
                key: "resetAutoBet",
                value: function () {
                  this.profit = 0;
                },
              },
              {
                key: "stopAutoBetting",
                value: function () {
                  this.autoModeState = null;
                },
              },
              {
                key: "autoHandleCrash",
                value: function (t) {
                  return "requested" === this.autoModeState
                    ? ((this.autoModeState = "betting"),
                      this.autoBetsLeft !== 1 / 0 &&
                        this.autoBetsLeft > 0 &&
                        (this.autoBetsLeft--,
                        Vt.h.dispatch((0, $t.bZ)(this.autoBetsLeft))),
                      Vt.h.dispatch(
                        (0, Y.MY)({
                          currency: this.startCurrency,
                          betAmount: this.betAmount,
                          autoCashout: this.targetCoef,
                          isAuto: !0,
                        }),
                      ))
                    : (t && (this.profit += t),
                      this.isCashedOut
                        ? this.dropBetOnWin
                          ? (this.betAmount = this.startBetAmount)
                          : ((this.betAmount += Math.floor(
                              (this.betAmount * this.wonBetMultiplier) / 100,
                            )),
                            Vt.h.dispatch((0, N.gQ)(this.betAmount)))
                        : this.dropBetOnLoose
                        ? (this.betAmount = this.startBetAmount)
                        : ((this.betAmount += Math.floor(
                            (this.betAmount * this.looseBetMultiplier) / 100,
                          )),
                          Vt.h.dispatch((0, N.gQ)(this.betAmount))),
                      this.emit("auto:crash", {
                        profit: this.profit,
                        nextBetAmount: this.betAmount,
                      }),
                      this.stopOnWon && this.stopOnWon <= this.profit
                        ? (Jt.Rt.info(
                            "",
                            (0, Kt.h)(
                              (0, Ut.getLocales)(
                                Ut.messages.autobet.stopOnWin(),
                              ),
                            ),
                          ),
                          void this.endAutoBetting())
                        : this.stopOnLoose && this.stopOnLoose <= -this.profit
                        ? (Jt.Rt.info(
                            "",
                            (0, Kt.h)(
                              (0, Ut.getLocales)(
                                Ut.messages.autobet.stopOnLoss(),
                              ),
                            ),
                          ),
                          void this.endAutoBetting())
                        : ((this.isCashedOut = !1),
                          void (this.autoBetsLeft > 0 ||
                          this.autoBetsLeft === 1 / 0
                            ? (this.autoBetsLeft !== 1 / 0 &&
                                this.autoBetsLeft > 0 &&
                                (this.autoBetsLeft--,
                                Vt.h.dispatch((0, $t.bZ)(this.autoBetsLeft))),
                              Vt.h.dispatch(
                                (0, Y.MY)({
                                  currency: this.startCurrency,
                                  betAmount: this.betAmount,
                                  autoCashout: this.targetCoef,
                                  isAuto: !0,
                                }),
                              ))
                            : (Jt.Rt.info(
                                "",
                                (0, Kt.h)(
                                  (0, Ut.getLocales)(
                                    Ut.messages.autobet.betsQuantity(),
                                  ),
                                ),
                              ),
                              this.endAutoBetting()))));
                },
              },
              {
                key: "configure",
                value: (function () {
                  var t = (0, G.Z)(
                    _().mark(function t() {
                      return _().wrap(
                        function (t) {
                          for (;;)
                            switch ((t.prev = t.next)) {
                              case 0:
                                Ht.Z.open(),
                                  Ht.Z.on("game_started", this.onGameStarted),
                                  Ht.Z.on("game_tick", this.onGameTick),
                                  Ht.Z.on("game_starting", this.onGameStarting),
                                  Ht.Z.on("player_bet", this.onPlayerBet),
                                  Ht.Z.on("cashed_out", this.onCashOut),
                                  Ht.Z.on("update", this.onUpdate),
                                  Ht.Z.on("game_crash", this.onGameCrash),
                                  Ht.Z.on("connect", this.join),
                                  this.join();
                              case 10:
                              case "end":
                                return t.stop();
                            }
                        },
                        t,
                        this,
                      );
                    }),
                  );
                  return function () {
                    return t.apply(this, arguments);
                  };
                })(),
              },
              {
                key: "close",
                value: function () {
                  Ht.Z.off("game_started", this.onGameStarted),
                    Ht.Z.off("game_tick", this.onGameTick),
                    Ht.Z.off("game_starting", this.onGameStarting),
                    Ht.Z.off("player_bet", this.onPlayerBet),
                    Ht.Z.off("cashed_out", this.onCashOut),
                    Ht.Z.off("update", this.onUpdate),
                    Ht.Z.off("game_crash", this.onGameCrash),
                    Ht.Z.off("connect", this.join),
                    Ht.Z.close(),
                    this.autoModeState && (this.autoModeState = null);
                },
              },
            ]),
            i
          );
        })(qt.EventEmitter),
        xe = new pe(),
        me = i(43876),
        ge = !0,
        ye = function () {
          (0, me.w)();
          var t = (0, D.z)(),
            e = (0, c.useRef)(null),
            i = (0, D.i)(function (t) {
              return t.user;
            }).isAuth,
            n = (0, D.i)(function (t) {
              return t.device;
            }),
            a = n.width,
            s = n.height,
            r = (0, D.i)(function (t) {
              return t.chat;
            }).isActive,
            o = (0, D.i)(function (t) {
              return t.crash;
            }),
            l = o.gameStatus,
            u = o.lastGameTick,
            f = o.startTime,
            d = o.lag;
          (0, c.useEffect)(
            function () {
              i && t((0, Y.Su)());
            },
            [i],
          ),
            (0, c.useEffect)(function () {
              if (ee.S)
                return (
                  xe.configure(),
                  function () {
                    xe.close();
                  }
                );
            }, []),
            (0, c.useEffect)(function () {
              return (
                ue.startRendering(e.current),
                ue.resize(),
                function () {
                  ue.stopRendering();
                }
              );
            }, []),
            (0, c.useEffect)(
              function () {
                ue.resize(),
                  setTimeout(function () {
                    ue.resize(), ue.resize();
                  }, 500),
                  setTimeout(function () {
                    ue.resize(), ue.resize();
                  }, 8e3);
              },
              [a, s, r, i],
            );
          var p = "IN_PROGRESS" === l,
            x = "ENDED" === l,
            m = (0, J.jz)(f, u, l, d),
            g = (0, J.x8)(m),
            y = p && g >= 50,
            b = "";
          switch (l) {
            case "IN_PROGRESS":
              b = "".concat(g.toFixed(2), "x - ");
              break;
            case "STARTING":
              b = "Game Starting - ";
              break;
            case "ENDED":
              b = "Crashed at ".concat(g.toFixed(2), "x - ");
          }
          return (0, v.jsxs)(v.Fragment, {
            children: [
              (0, v.jsx)(h(), {
                children: (0, v.jsxs)("title", {
                  children: [b, "Bloxmoon - Premium Roblox Gambling"],
                }),
              }),
              (0, v.jsx)(w, {}),
              (0, v.jsxs)(be, {
                children: [
                  (0, v.jsx)(lt, {}),
                  (0, v.jsxs)(ve, {
                    children: [
                      (0, v.jsx)(Ze, {
                        isGold: y,
                        isBusted: x,
                        children: (0, v.jsx)(je, {
                          ref: e,
                        }),
                      }),
                      (0, v.jsx)(rt, {}),
                    ],
                  }),
                  (0, v.jsx)(_t, {}),
                ],
              }),
            ],
          });
        },
        be = (0, s.Z)("div", {
          target: "e1g3xb1u3",
          label: "crash--Wrapper",
        })(
          "position:relative;height:auto;display:grid;grid-template:auto minmax(508px, 1fr)/minmax(400px, 800px) minmax(\n      200px,\n      250px\n    );grid-auto-flow:column;justify-content:center;grid-gap:15px 90px;padding:50px;",
          f.PJ,
          "{grid-template:auto 1fr/minmax(400px, 800px) minmax(200px, 250px);grid-gap:15px 30px;padding:30px;}",
          f.ai,
          "{grid-template:auto 1fr auto/1fr;grid-auto-flow:row;height:auto;padding:10px;}",
        ),
        ve = (0, s.Z)("div", {
          target: "e1g3xb1u2",
          label: "crash--GameContainer",
        })(
          "z-index:0;display:flex;flex-direction:column;justify-content:start;align-items:center;gap:15px;height:100%;",
          f.ai,
          "{width:100%;}",
        ),
        we = (0, r.keyframes)(
          de ||
            (de = (0, a.Z)([
              "\n  0% {\n    clip-path: inset(0 0 90% 0);\n  }\n  25% {\n    clip-path: inset(0 90% 0 0);\n  }\n  50% {\n    clip-path: inset(90% 0 0 0);\n  }\n  75% {\n    clip-path: inset(0 0 0 90%);\n  }\n  100% {\n    clip-path: inset(0 0 90% 0);\n  }\n",
            ])),
        ),
        Ze = (0, s.Z)("div", {
          target: "e1g3xb1u1",
          label: "crash--CanvasWrapper",
        })(
          "position:relative;width:100%;max-width:800px;height:400px;border-radius:30px;transition:all 0.3s;&::before,&::after{display:none;content:'';position:absolute;top:0;left:0;right:0;bottom:0;border:3px solid ",
          function (t) {
            return t.theme.colors.crash.canvasBorderGold;
          },
          ";border-radius:30px;transition:all 0.5s;animation:",
          we,
          " 10s infinite linear;}&::before{animation:",
          we,
          " 10s infinite -5s linear;}",
          function (t) {
            var e = t.isBusted,
              i = t.theme;
            return (
              e && "outline: 3px solid ".concat(i.colors.crash.canvasBorderRed)
            );
          },
          " ",
          function (t) {
            return (
              t.isGold &&
              "\n      &::before,\n      &::after {\n        display: block;\n    }"
            );
          },
          ";",
        ),
        je = (0, s.Z)("canvas", {
          target: "e1g3xb1u0",
          label: "crash--Canvas",
        })(
          "position:relative;width:100%;height:100%;border-radius:30px;",
          f.ai,
          "{margin-top:0;}",
        );
    },
    63781: function (t, e, i) {
      (window.__NEXT_P = window.__NEXT_P || []).push([
        "/crash",
        function () {
          return i(92312);
        },
      ]);
    },
  },
  function (t) {
    t.O(0, [935, 774, 888, 179], function () {
      return (e = 63781), t((t.s = e));
      var e;
    });
    var e = t.O();
    _N_E = e;
  },
]);
