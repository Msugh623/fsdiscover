const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/Index-DvxfPTXZ.js",
      "assets/index-Ct0J25As.js",
      "assets/index-Cm_tyPBb.css",
    ])
) => i.map((i) => d[i]);
import {
  r as y,
  R as Ho,
  a as H,
  j as i,
  b as Ne,
  P as Ee,
  G as U,
  c as Jt,
  g as Bt,
  D as ve,
  F as Ca,
  d as Oa,
  e as Uo,
  f as zo,
  h as $o,
  L as Wo,
  _ as Vo,
} from "./index-Ct0J25As.js";
/**
 * @remix-run/router v1.23.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function At() {
  return (
    (At = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    At.apply(this, arguments)
  );
}
var Xe;
(function (e) {
  (e.Pop = "POP"), (e.Push = "PUSH"), (e.Replace = "REPLACE");
})(Xe || (Xe = {}));
const _s = "popstate";
function qo(e) {
  e === void 0 && (e = {});
  function t(r, s) {
    let { pathname: a, search: o, hash: c } = r.location;
    return ur(
      "",
      { pathname: a, search: o, hash: c },
      (s.state && s.state.usr) || null,
      (s.state && s.state.key) || "default"
    );
  }
  function n(r, s) {
    return typeof s == "string" ? s : mn(s);
  }
  return Xo(t, n, null, e);
}
function ee(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function Aa(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function Yo() {
  return Math.random().toString(36).substr(2, 8);
}
function Cs(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function ur(e, t, n, r) {
  return (
    n === void 0 && (n = null),
    At(
      { pathname: typeof e == "string" ? e : e.pathname, search: "", hash: "" },
      typeof t == "string" ? gt(t) : t,
      { state: n, key: (t && t.key) || r || Yo() }
    )
  );
}
function mn(e) {
  let { pathname: t = "/", search: n = "", hash: r = "" } = e;
  return (
    n && n !== "?" && (t += n.charAt(0) === "?" ? n : "?" + n),
    r && r !== "#" && (t += r.charAt(0) === "#" ? r : "#" + r),
    t
  );
}
function gt(e) {
  let t = {};
  if (e) {
    let n = e.indexOf("#");
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
    let r = e.indexOf("?");
    r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))),
      e && (t.pathname = e);
  }
  return t;
}
function Xo(e, t, n, r) {
  r === void 0 && (r = {});
  let { window: s = document.defaultView, v5Compat: a = !1 } = r,
    o = s.history,
    c = Xe.Pop,
    l = null,
    u = d();
  u == null && ((u = 0), o.replaceState(At({}, o.state, { idx: u }), ""));
  function d() {
    return (o.state || { idx: null }).idx;
  }
  function h() {
    c = Xe.Pop;
    let m = d(),
      w = m == null ? null : m - u;
    (u = m), l && l({ action: c, location: g.location, delta: w });
  }
  function p(m, w) {
    c = Xe.Push;
    let T = ur(g.location, m, w);
    u = d() + 1;
    let N = Cs(T, u),
      _ = g.createHref(T);
    try {
      o.pushState(N, "", _);
    } catch (O) {
      if (O instanceof DOMException && O.name === "DataCloneError") throw O;
      s.location.assign(_);
    }
    a && l && l({ action: c, location: g.location, delta: 1 });
  }
  function x(m, w) {
    c = Xe.Replace;
    let T = ur(g.location, m, w);
    u = d();
    let N = Cs(T, u),
      _ = g.createHref(T);
    o.replaceState(N, "", _),
      a && l && l({ action: c, location: g.location, delta: 0 });
  }
  function v(m) {
    let w = s.location.origin !== "null" ? s.location.origin : s.location.href,
      T = typeof m == "string" ? m : mn(m);
    return (
      (T = T.replace(/ $/, "%20")),
      ee(
        w,
        "No window.location.(origin|href) available to create URL for href: " +
          T
      ),
      new URL(T, w)
    );
  }
  let g = {
    get action() {
      return c;
    },
    get location() {
      return e(s, o);
    },
    listen(m) {
      if (l) throw new Error("A history only accepts one active listener");
      return (
        s.addEventListener(_s, h),
        (l = m),
        () => {
          s.removeEventListener(_s, h), (l = null);
        }
      );
    },
    createHref(m) {
      return t(s, m);
    },
    createURL: v,
    encodeLocation(m) {
      let w = v(m);
      return { pathname: w.pathname, search: w.search, hash: w.hash };
    },
    push: p,
    replace: x,
    go(m) {
      return o.go(m);
    },
  };
  return g;
}
var Os;
(function (e) {
  (e.data = "data"),
    (e.deferred = "deferred"),
    (e.redirect = "redirect"),
    (e.error = "error");
})(Os || (Os = {}));
function Jo(e, t, n) {
  return n === void 0 && (n = "/"), Go(e, t, n);
}
function Go(e, t, n, r) {
  let s = typeof t == "string" ? gt(t) : t,
    a = Yr(s.pathname || "/", n);
  if (a == null) return null;
  let o = ka(e);
  Ko(o);
  let c = null;
  for (let l = 0; c == null && l < o.length; ++l) {
    let u = lc(a);
    c = ic(o[l], u);
  }
  return c;
}
function ka(e, t, n, r) {
  t === void 0 && (t = []), n === void 0 && (n = []), r === void 0 && (r = "");
  let s = (a, o, c) => {
    let l = {
      relativePath: c === void 0 ? a.path || "" : c,
      caseSensitive: a.caseSensitive === !0,
      childrenIndex: o,
      route: a,
    };
    l.relativePath.startsWith("/") &&
      (ee(
        l.relativePath.startsWith(r),
        'Absolute route path "' +
          l.relativePath +
          '" nested under path ' +
          ('"' + r + '" is not valid. An absolute child route path ') +
          "must start with the combined path of all its parent routes."
      ),
      (l.relativePath = l.relativePath.slice(r.length)));
    let u = Je([r, l.relativePath]),
      d = n.concat(l);
    a.children &&
      a.children.length > 0 &&
      (ee(
        a.index !== !0,
        "Index routes must not have child routes. Please remove " +
          ('all child routes from route path "' + u + '".')
      ),
      ka(a.children, t, d, u)),
      !(a.path == null && !a.index) &&
        t.push({ path: u, score: sc(u, a.index), routesMeta: d });
  };
  return (
    e.forEach((a, o) => {
      var c;
      if (a.path === "" || !((c = a.path) != null && c.includes("?"))) s(a, o);
      else for (let l of Ra(a.path)) s(a, o, l);
    }),
    t
  );
}
function Ra(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [n, ...r] = t,
    s = n.endsWith("?"),
    a = n.replace(/\?$/, "");
  if (r.length === 0) return s ? [a, ""] : [a];
  let o = Ra(r.join("/")),
    c = [];
  return (
    c.push(...o.map((l) => (l === "" ? a : [a, l].join("/")))),
    s && c.push(...o),
    c.map((l) => (e.startsWith("/") && l === "" ? "/" : l))
  );
}
function Ko(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : ac(
          t.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex)
        )
  );
}
const Qo = /^:[\w-]+$/,
  Zo = 3,
  ec = 2,
  tc = 1,
  nc = 10,
  rc = -2,
  As = (e) => e === "*";
function sc(e, t) {
  let n = e.split("/"),
    r = n.length;
  return (
    n.some(As) && (r += rc),
    t && (r += ec),
    n
      .filter((s) => !As(s))
      .reduce((s, a) => s + (Qo.test(a) ? Zo : a === "" ? tc : nc), r)
  );
}
function ac(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, s) => r === t[s])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function ic(e, t, n) {
  let { routesMeta: r } = e,
    s = {},
    a = "/",
    o = [];
  for (let c = 0; c < r.length; ++c) {
    let l = r[c],
      u = c === r.length - 1,
      d = a === "/" ? t : t.slice(a.length) || "/",
      h = oc(
        { path: l.relativePath, caseSensitive: l.caseSensitive, end: u },
        d
      ),
      p = l.route;
    if (!h) return null;
    Object.assign(s, h.params),
      o.push({
        params: s,
        pathname: Je([a, h.pathname]),
        pathnameBase: fc(Je([a, h.pathnameBase])),
        route: p,
      }),
      h.pathnameBase !== "/" && (a = Je([a, h.pathnameBase]));
  }
  return o;
}
function oc(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = cc(e.path, e.caseSensitive, e.end),
    s = t.match(n);
  if (!s) return null;
  let a = s[0],
    o = a.replace(/(.)\/+$/, "$1"),
    c = s.slice(1);
  return {
    params: r.reduce((u, d, h) => {
      let { paramName: p, isOptional: x } = d;
      if (p === "*") {
        let g = c[h] || "";
        o = a.slice(0, a.length - g.length).replace(/(.)\/+$/, "$1");
      }
      const v = c[h];
      return (
        x && !v ? (u[p] = void 0) : (u[p] = (v || "").replace(/%2F/g, "/")), u
      );
    }, {}),
    pathname: a,
    pathnameBase: o,
    pattern: e,
  };
}
function cc(e, t, n) {
  t === void 0 && (t = !1),
    n === void 0 && (n = !0),
    Aa(
      e === "*" || !e.endsWith("*") || e.endsWith("/*"),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, "/*") + '" because the `*` character must ') +
        "always follow a `/` in the pattern. To get rid of this warning, " +
        ('please change the route path to "' + e.replace(/\*$/, "/*") + '".')
    );
  let r = [],
    s =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (o, c, l) => (
            r.push({ paramName: c, isOptional: l != null }),
            l ? "/?([^\\/]+)?" : "/([^\\/]+)"
          )
        );
  return (
    e.endsWith("*")
      ? (r.push({ paramName: "*" }),
        (s += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : n
      ? (s += "\\/*$")
      : e !== "" && e !== "/" && (s += "(?:(?=\\/|$))"),
    [new RegExp(s, t ? void 0 : "i"), r]
  );
}
function lc(e) {
  try {
    return e
      .split("/")
      .map((t) => decodeURIComponent(t).replace(/\//g, "%2F"))
      .join("/");
  } catch (t) {
    return (
      Aa(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ("encoding (" + t + ").")
      ),
      e
    );
  }
}
function Yr(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith("/") ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== "/" ? null : e.slice(n) || "/";
}
function uc(e, t) {
  t === void 0 && (t = "/");
  let {
    pathname: n,
    search: r = "",
    hash: s = "",
  } = typeof e == "string" ? gt(e) : e;
  return {
    pathname: n ? (n.startsWith("/") ? n : dc(n, t)) : t,
    search: mc(r),
    hash: pc(s),
  };
}
function dc(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((s) => {
      s === ".." ? n.length > 1 && n.pop() : s !== "." && n.push(s);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function Jn(e, t, n, r) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ("`to." +
      t +
      "` field [" +
      JSON.stringify(r) +
      "].  Please separate it out to the ") +
    ("`to." + n + "` field. Alternatively you may provide the full path as ") +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function hc(e) {
  return e.filter(
    (t, n) => n === 0 || (t.route.path && t.route.path.length > 0)
  );
}
function Pa(e, t) {
  let n = hc(e);
  return t
    ? n.map((r, s) => (s === n.length - 1 ? r.pathname : r.pathnameBase))
    : n.map((r) => r.pathnameBase);
}
function Da(e, t, n, r) {
  r === void 0 && (r = !1);
  let s;
  typeof e == "string"
    ? (s = gt(e))
    : ((s = At({}, e)),
      ee(
        !s.pathname || !s.pathname.includes("?"),
        Jn("?", "pathname", "search", s)
      ),
      ee(
        !s.pathname || !s.pathname.includes("#"),
        Jn("#", "pathname", "hash", s)
      ),
      ee(!s.search || !s.search.includes("#"), Jn("#", "search", "hash", s)));
  let a = e === "" || s.pathname === "",
    o = a ? "/" : s.pathname,
    c;
  if (o == null) c = n;
  else {
    let h = t.length - 1;
    if (!r && o.startsWith("..")) {
      let p = o.split("/");
      for (; p[0] === ".."; ) p.shift(), (h -= 1);
      s.pathname = p.join("/");
    }
    c = h >= 0 ? t[h] : "/";
  }
  let l = uc(s, c),
    u = o && o !== "/" && o.endsWith("/"),
    d = (a || o === ".") && n.endsWith("/");
  return !l.pathname.endsWith("/") && (u || d) && (l.pathname += "/"), l;
}
const Je = (e) => e.join("/").replace(/\/\/+/g, "/"),
  fc = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  mc = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  pc = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e);
function gc(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
const La = ["post", "put", "patch", "delete"];
new Set(La);
const yc = ["get", ...La];
new Set(yc);
/**
 * React Router v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function kt() {
  return (
    (kt = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    kt.apply(this, arguments)
  );
}
const Xr = y.createContext(null),
  vc = y.createContext(null),
  at = y.createContext(null),
  wn = y.createContext(null),
  qe = y.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  Ia = y.createContext(null);
function xc(e, t) {
  let { relative: n } = t === void 0 ? {} : t;
  Ft() || ee(!1);
  let { basename: r, navigator: s } = y.useContext(at),
    { hash: a, pathname: o, search: c } = Ba(e, { relative: n }),
    l = o;
  return (
    r !== "/" && (l = o === "/" ? r : Je([r, o])),
    s.createHref({ pathname: l, search: c, hash: a })
  );
}
function Ft() {
  return y.useContext(wn) != null;
}
function We() {
  return Ft() || ee(!1), y.useContext(wn).location;
}
function Ma(e) {
  y.useContext(at).static || y.useLayoutEffect(e);
}
function Re() {
  let { isDataRoute: e } = y.useContext(qe);
  return e ? Lc() : bc();
}
function bc() {
  Ft() || ee(!1);
  let e = y.useContext(Xr),
    { basename: t, future: n, navigator: r } = y.useContext(at),
    { matches: s } = y.useContext(qe),
    { pathname: a } = We(),
    o = JSON.stringify(Pa(s, n.v7_relativeSplatPath)),
    c = y.useRef(!1);
  return (
    Ma(() => {
      c.current = !0;
    }),
    y.useCallback(
      function (u, d) {
        if ((d === void 0 && (d = {}), !c.current)) return;
        if (typeof u == "number") {
          r.go(u);
          return;
        }
        let h = Da(u, JSON.parse(o), a, d.relative === "path");
        e == null &&
          t !== "/" &&
          (h.pathname = h.pathname === "/" ? t : Je([t, h.pathname])),
          (d.replace ? r.replace : r.push)(h, d.state, d);
      },
      [t, r, o, a, e]
    )
  );
}
const wc = y.createContext(null);
function Nc(e) {
  let t = y.useContext(qe).outlet;
  return t && y.createElement(wc.Provider, { value: e }, t);
}
function Ec() {
  let { matches: e } = y.useContext(qe),
    t = e[e.length - 1];
  return t ? t.params : {};
}
function Ba(e, t) {
  let { relative: n } = t === void 0 ? {} : t,
    { future: r } = y.useContext(at),
    { matches: s } = y.useContext(qe),
    { pathname: a } = We(),
    o = JSON.stringify(Pa(s, r.v7_relativeSplatPath));
  return y.useMemo(() => Da(e, JSON.parse(o), a, n === "path"), [e, o, a, n]);
}
function Tc(e, t) {
  return Sc(e, t);
}
function Sc(e, t, n, r) {
  Ft() || ee(!1);
  let { navigator: s } = y.useContext(at),
    { matches: a } = y.useContext(qe),
    o = a[a.length - 1],
    c = o ? o.params : {};
  o && o.pathname;
  let l = o ? o.pathnameBase : "/";
  o && o.route;
  let u = We(),
    d;
  if (t) {
    var h;
    let m = typeof t == "string" ? gt(t) : t;
    l === "/" || ((h = m.pathname) != null && h.startsWith(l)) || ee(!1),
      (d = m);
  } else d = u;
  let p = d.pathname || "/",
    x = p;
  if (l !== "/") {
    let m = l.replace(/^\//, "").split("/");
    x = "/" + p.replace(/^\//, "").split("/").slice(m.length).join("/");
  }
  let v = Jo(e, { pathname: x }),
    g = Ac(
      v &&
        v.map((m) =>
          Object.assign({}, m, {
            params: Object.assign({}, c, m.params),
            pathname: Je([
              l,
              s.encodeLocation
                ? s.encodeLocation(m.pathname).pathname
                : m.pathname,
            ]),
            pathnameBase:
              m.pathnameBase === "/"
                ? l
                : Je([
                    l,
                    s.encodeLocation
                      ? s.encodeLocation(m.pathnameBase).pathname
                      : m.pathnameBase,
                  ]),
          })
        ),
      a,
      n,
      r
    );
  return t && g
    ? y.createElement(
        wn.Provider,
        {
          value: {
            location: kt(
              {
                pathname: "/",
                search: "",
                hash: "",
                state: null,
                key: "default",
              },
              d
            ),
            navigationType: Xe.Pop,
          },
        },
        g
      )
    : g;
}
function jc() {
  let e = Dc(),
    t = gc(e)
      ? e.status + " " + e.statusText
      : e instanceof Error
      ? e.message
      : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null,
    s = { padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)" };
  return y.createElement(
    y.Fragment,
    null,
    y.createElement("h2", null, "Unexpected Application Error!"),
    y.createElement("h3", { style: { fontStyle: "italic" } }, t),
    n ? y.createElement("pre", { style: s }, n) : null,
    null
  );
}
const _c = y.createElement(jc, null);
class Cc extends y.Component {
  constructor(t) {
    super(t),
      (this.state = {
        location: t.location,
        revalidation: t.revalidation,
        error: t.error,
      });
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location ||
      (n.revalidation !== "idle" && t.revalidation === "idle")
      ? { error: t.error, location: t.location, revalidation: t.revalidation }
      : {
          error: t.error !== void 0 ? t.error : n.error,
          location: n.location,
          revalidation: t.revalidation || n.revalidation,
        };
  }
  componentDidCatch(t, n) {
    console.error(
      "React Router caught the following error during render",
      t,
      n
    );
  }
  render() {
    return this.state.error !== void 0
      ? y.createElement(
          qe.Provider,
          { value: this.props.routeContext },
          y.createElement(Ia.Provider, {
            value: this.state.error,
            children: this.props.component,
          })
        )
      : this.props.children;
  }
}
function Oc(e) {
  let { routeContext: t, match: n, children: r } = e,
    s = y.useContext(Xr);
  return (
    s &&
      s.static &&
      s.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (s.staticContext._deepestRenderedBoundaryId = n.route.id),
    y.createElement(qe.Provider, { value: t }, r)
  );
}
function Ac(e, t, n, r) {
  var s;
  if (
    (t === void 0 && (t = []),
    n === void 0 && (n = null),
    r === void 0 && (r = null),
    e == null)
  ) {
    var a;
    if (!n) return null;
    if (n.errors) e = n.matches;
    else if (
      (a = r) != null &&
      a.v7_partialHydration &&
      t.length === 0 &&
      !n.initialized &&
      n.matches.length > 0
    )
      e = n.matches;
    else return null;
  }
  let o = e,
    c = (s = n) == null ? void 0 : s.errors;
  if (c != null) {
    let d = o.findIndex(
      (h) => h.route.id && (c == null ? void 0 : c[h.route.id]) !== void 0
    );
    d >= 0 || ee(!1), (o = o.slice(0, Math.min(o.length, d + 1)));
  }
  let l = !1,
    u = -1;
  if (n && r && r.v7_partialHydration)
    for (let d = 0; d < o.length; d++) {
      let h = o[d];
      if (
        ((h.route.HydrateFallback || h.route.hydrateFallbackElement) && (u = d),
        h.route.id)
      ) {
        let { loaderData: p, errors: x } = n,
          v =
            h.route.loader &&
            p[h.route.id] === void 0 &&
            (!x || x[h.route.id] === void 0);
        if (h.route.lazy || v) {
          (l = !0), u >= 0 ? (o = o.slice(0, u + 1)) : (o = [o[0]]);
          break;
        }
      }
    }
  return o.reduceRight((d, h, p) => {
    let x,
      v = !1,
      g = null,
      m = null;
    n &&
      ((x = c && h.route.id ? c[h.route.id] : void 0),
      (g = h.route.errorElement || _c),
      l &&
        (u < 0 && p === 0
          ? (Ic("route-fallback"), (v = !0), (m = null))
          : u === p &&
            ((v = !0), (m = h.route.hydrateFallbackElement || null))));
    let w = t.concat(o.slice(0, p + 1)),
      T = () => {
        let N;
        return (
          x
            ? (N = g)
            : v
            ? (N = m)
            : h.route.Component
            ? (N = y.createElement(h.route.Component, null))
            : h.route.element
            ? (N = h.route.element)
            : (N = d),
          y.createElement(Oc, {
            match: h,
            routeContext: { outlet: d, matches: w, isDataRoute: n != null },
            children: N,
          })
        );
      };
    return n && (h.route.ErrorBoundary || h.route.errorElement || p === 0)
      ? y.createElement(Cc, {
          location: n.location,
          revalidation: n.revalidation,
          component: g,
          error: x,
          children: T(),
          routeContext: { outlet: null, matches: w, isDataRoute: !0 },
        })
      : T();
  }, null);
}
var Fa = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      e
    );
  })(Fa || {}),
  Ha = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseLoaderData = "useLoaderData"),
      (e.UseActionData = "useActionData"),
      (e.UseRouteError = "useRouteError"),
      (e.UseNavigation = "useNavigation"),
      (e.UseRouteLoaderData = "useRouteLoaderData"),
      (e.UseMatches = "useMatches"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      (e.UseRouteId = "useRouteId"),
      e
    );
  })(Ha || {});
function kc(e) {
  let t = y.useContext(Xr);
  return t || ee(!1), t;
}
function Rc(e) {
  let t = y.useContext(vc);
  return t || ee(!1), t;
}
function Pc(e) {
  let t = y.useContext(qe);
  return t || ee(!1), t;
}
function Ua(e) {
  let t = Pc(),
    n = t.matches[t.matches.length - 1];
  return n.route.id || ee(!1), n.route.id;
}
function Dc() {
  var e;
  let t = y.useContext(Ia),
    n = Rc(),
    r = Ua();
  return t !== void 0 ? t : (e = n.errors) == null ? void 0 : e[r];
}
function Lc() {
  let { router: e } = kc(Fa.UseNavigateStable),
    t = Ua(Ha.UseNavigateStable),
    n = y.useRef(!1);
  return (
    Ma(() => {
      n.current = !0;
    }),
    y.useCallback(
      function (s, a) {
        a === void 0 && (a = {}),
          n.current &&
            (typeof s == "number"
              ? e.navigate(s)
              : e.navigate(s, kt({ fromRouteId: t }, a)));
      },
      [e, t]
    )
  );
}
const ks = {};
function Ic(e, t, n) {
  ks[e] || (ks[e] = !0);
}
function Mc(e, t) {
  e == null || e.v7_startTransition, e == null || e.v7_relativeSplatPath;
}
function Jr(e) {
  return Nc(e.context);
}
function oe(e) {
  ee(!1);
}
function Bc(e) {
  let {
    basename: t = "/",
    children: n = null,
    location: r,
    navigationType: s = Xe.Pop,
    navigator: a,
    static: o = !1,
    future: c,
  } = e;
  Ft() && ee(!1);
  let l = t.replace(/^\/*/, "/"),
    u = y.useMemo(
      () => ({
        basename: l,
        navigator: a,
        static: o,
        future: kt({ v7_relativeSplatPath: !1 }, c),
      }),
      [l, c, a, o]
    );
  typeof r == "string" && (r = gt(r));
  let {
      pathname: d = "/",
      search: h = "",
      hash: p = "",
      state: x = null,
      key: v = "default",
    } = r,
    g = y.useMemo(() => {
      let m = Yr(d, l);
      return m == null
        ? null
        : {
            location: { pathname: m, search: h, hash: p, state: x, key: v },
            navigationType: s,
          };
    }, [l, d, h, p, x, v, s]);
  return g == null
    ? null
    : y.createElement(
        at.Provider,
        { value: u },
        y.createElement(wn.Provider, { children: n, value: g })
      );
}
function Fc(e) {
  let { children: t, location: n } = e;
  return Tc(dr(t), n);
}
new Promise(() => {});
function dr(e, t) {
  t === void 0 && (t = []);
  let n = [];
  return (
    y.Children.forEach(e, (r, s) => {
      if (!y.isValidElement(r)) return;
      let a = [...t, s];
      if (r.type === y.Fragment) {
        n.push.apply(n, dr(r.props.children, a));
        return;
      }
      r.type !== oe && ee(!1), !r.props.index || !r.props.children || ee(!1);
      let o = {
        id: r.props.id || a.join("-"),
        caseSensitive: r.props.caseSensitive,
        element: r.props.element,
        Component: r.props.Component,
        index: r.props.index,
        path: r.props.path,
        loader: r.props.loader,
        action: r.props.action,
        errorElement: r.props.errorElement,
        ErrorBoundary: r.props.ErrorBoundary,
        hasErrorBoundary:
          r.props.ErrorBoundary != null || r.props.errorElement != null,
        shouldRevalidate: r.props.shouldRevalidate,
        handle: r.props.handle,
        lazy: r.props.lazy,
      };
      r.props.children && (o.children = dr(r.props.children, a)), n.push(o);
    }),
    n
  );
}
/**
 * React Router DOM v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function hr() {
  return (
    (hr = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    hr.apply(this, arguments)
  );
}
function Hc(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    s,
    a;
  for (a = 0; a < r.length; a++)
    (s = r[a]), !(t.indexOf(s) >= 0) && (n[s] = e[s]);
  return n;
}
function Uc(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function zc(e, t) {
  return e.button === 0 && (!t || t === "_self") && !Uc(e);
}
function fr(e) {
  return (
    e === void 0 && (e = ""),
    new URLSearchParams(
      typeof e == "string" || Array.isArray(e) || e instanceof URLSearchParams
        ? e
        : Object.keys(e).reduce((t, n) => {
            let r = e[n];
            return t.concat(Array.isArray(r) ? r.map((s) => [n, s]) : [[n, r]]);
          }, [])
    )
  );
}
function $c(e, t) {
  let n = fr(e);
  return (
    t &&
      t.forEach((r, s) => {
        n.has(s) ||
          t.getAll(s).forEach((a) => {
            n.append(s, a);
          });
      }),
    n
  );
}
const Wc = [
    "onClick",
    "relative",
    "reloadDocument",
    "replace",
    "state",
    "target",
    "to",
    "preventScrollReset",
    "viewTransition",
  ],
  Vc = "6";
try {
  window.__reactRouterVersion = Vc;
} catch {}
const qc = "startTransition",
  Rs = Ho[qc];
function Yc(e) {
  let { basename: t, children: n, future: r, window: s } = e,
    a = y.useRef();
  a.current == null && (a.current = qo({ window: s, v5Compat: !0 }));
  let o = a.current,
    [c, l] = y.useState({ action: o.action, location: o.location }),
    { v7_startTransition: u } = r || {},
    d = y.useCallback(
      (h) => {
        u && Rs ? Rs(() => l(h)) : l(h);
      },
      [l, u]
    );
  return (
    y.useLayoutEffect(() => o.listen(d), [o, d]),
    y.useEffect(() => Mc(r), [r]),
    y.createElement(Bc, {
      basename: t,
      children: n,
      location: c.location,
      navigationType: c.action,
      navigator: o,
      future: r,
    })
  );
}
const Xc =
    typeof window < "u" &&
    typeof window.document < "u" &&
    typeof window.document.createElement < "u",
  Jc = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  xe = y.forwardRef(function (t, n) {
    let {
        onClick: r,
        relative: s,
        reloadDocument: a,
        replace: o,
        state: c,
        target: l,
        to: u,
        preventScrollReset: d,
        viewTransition: h,
      } = t,
      p = Hc(t, Wc),
      { basename: x } = y.useContext(at),
      v,
      g = !1;
    if (typeof u == "string" && Jc.test(u) && ((v = u), Xc))
      try {
        let N = new URL(window.location.href),
          _ = u.startsWith("//") ? new URL(N.protocol + u) : new URL(u),
          O = Yr(_.pathname, x);
        _.origin === N.origin && O != null
          ? (u = O + _.search + _.hash)
          : (g = !0);
      } catch {}
    let m = xc(u, { relative: s }),
      w = Gc(u, {
        replace: o,
        state: c,
        target: l,
        preventScrollReset: d,
        relative: s,
        viewTransition: h,
      });
    function T(N) {
      r && r(N), N.defaultPrevented || w(N);
    }
    return y.createElement(
      "a",
      hr({}, p, { href: v || m, onClick: g || a ? r : T, ref: n, target: l })
    );
  });
var Ps;
(function (e) {
  (e.UseScrollRestoration = "useScrollRestoration"),
    (e.UseSubmit = "useSubmit"),
    (e.UseSubmitFetcher = "useSubmitFetcher"),
    (e.UseFetcher = "useFetcher"),
    (e.useViewTransitionState = "useViewTransitionState");
})(Ps || (Ps = {}));
var Ds;
(function (e) {
  (e.UseFetcher = "useFetcher"),
    (e.UseFetchers = "useFetchers"),
    (e.UseScrollRestoration = "useScrollRestoration");
})(Ds || (Ds = {}));
function Gc(e, t) {
  let {
      target: n,
      replace: r,
      state: s,
      preventScrollReset: a,
      relative: o,
      viewTransition: c,
    } = t === void 0 ? {} : t,
    l = Re(),
    u = We(),
    d = Ba(e, { relative: o });
  return y.useCallback(
    (h) => {
      if (zc(h, n)) {
        h.preventDefault();
        let p = r !== void 0 ? r : mn(u) === mn(d);
        l(e, {
          replace: p,
          state: s,
          preventScrollReset: a,
          relative: o,
          viewTransition: c,
        });
      }
    },
    [u, l, d, r, s, n, e, a, o, c]
  );
}
function Kc(e) {
  let t = y.useRef(fr(e)),
    n = y.useRef(!1),
    r = We(),
    s = y.useMemo(() => $c(r.search, n.current ? null : t.current), [r.search]),
    a = Re(),
    o = y.useCallback(
      (c, l) => {
        const u = fr(typeof c == "function" ? c(s) : c);
        (n.current = !0), a("?" + u, l);
      },
      [a, s]
    );
  return [s, o];
}
function za(e) {
  var t,
    n,
    r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object")
    if (Array.isArray(e)) {
      var s = e.length;
      for (t = 0; t < s; t++)
        e[t] && (n = za(e[t])) && (r && (r += " "), (r += n));
    } else for (n in e) e[n] && (r && (r += " "), (r += n));
  return r;
}
function ke() {
  for (var e, t, n = 0, r = "", s = arguments.length; n < s; n++)
    (e = arguments[n]) && (t = za(e)) && (r && (r += " "), (r += t));
  return r;
}
const Rt = (e) => typeof e == "number" && !isNaN(e),
  et = (e) => typeof e == "string",
  je = (e) => typeof e == "function",
  nn = (e) => (et(e) || je(e) ? e : null),
  mr = (e) => y.isValidElement(e) || et(e) || je(e) || Rt(e);
function Qc(e, t, n) {
  n === void 0 && (n = 300);
  const { scrollHeight: r, style: s } = e;
  requestAnimationFrame(() => {
    (s.minHeight = "initial"),
      (s.height = r + "px"),
      (s.transition = `all ${n}ms`),
      requestAnimationFrame(() => {
        (s.height = "0"), (s.padding = "0"), (s.margin = "0"), setTimeout(t, n);
      });
  });
}
function Nn(e) {
  let {
    enter: t,
    exit: n,
    appendPosition: r = !1,
    collapse: s = !0,
    collapseDuration: a = 300,
  } = e;
  return function (o) {
    let {
      children: c,
      position: l,
      preventExitTransition: u,
      done: d,
      nodeRef: h,
      isIn: p,
      playToast: x,
    } = o;
    const v = r ? `${t}--${l}` : t,
      g = r ? `${n}--${l}` : n,
      m = y.useRef(0);
    return (
      y.useLayoutEffect(() => {
        const w = h.current,
          T = v.split(" "),
          N = (_) => {
            _.target === h.current &&
              (x(),
              w.removeEventListener("animationend", N),
              w.removeEventListener("animationcancel", N),
              m.current === 0 &&
                _.type !== "animationcancel" &&
                w.classList.remove(...T));
          };
        w.classList.add(...T),
          w.addEventListener("animationend", N),
          w.addEventListener("animationcancel", N);
      }, []),
      y.useEffect(() => {
        const w = h.current,
          T = () => {
            w.removeEventListener("animationend", T), s ? Qc(w, d, a) : d();
          };
        p ||
          (u
            ? T()
            : ((m.current = 1),
              (w.className += ` ${g}`),
              w.addEventListener("animationend", T)));
      }, [p]),
      H.createElement(H.Fragment, null, c)
    );
  };
}
function Ls(e, t) {
  return e != null
    ? {
        content: e.content,
        containerId: e.props.containerId,
        id: e.props.toastId,
        theme: e.props.theme,
        type: e.props.type,
        data: e.props.data || {},
        isLoading: e.props.isLoading,
        icon: e.props.icon,
        status: t,
      }
    : {};
}
const fe = new Map();
let Pt = [];
const pr = new Set(),
  Zc = (e) => pr.forEach((t) => t(e)),
  $a = () => fe.size > 0;
function Wa(e, t) {
  var n;
  if (t) return !((n = fe.get(t)) == null || !n.isToastActive(e));
  let r = !1;
  return (
    fe.forEach((s) => {
      s.isToastActive(e) && (r = !0);
    }),
    r
  );
}
function Va(e, t) {
  mr(e) &&
    ($a() || Pt.push({ content: e, options: t }),
    fe.forEach((n) => {
      n.buildToast(e, t);
    }));
}
function Is(e, t) {
  fe.forEach((n) => {
    t != null && t != null && t.containerId
      ? (t == null ? void 0 : t.containerId) === n.id &&
        n.toggle(e, t == null ? void 0 : t.id)
      : n.toggle(e, t == null ? void 0 : t.id);
  });
}
function el(e) {
  const {
    subscribe: t,
    getSnapshot: n,
    setProps: r,
  } = y.useRef(
    (function (a) {
      const o = a.containerId || 1;
      return {
        subscribe(c) {
          const l = (function (d, h, p) {
            let x = 1,
              v = 0,
              g = [],
              m = [],
              w = [],
              T = h;
            const N = new Map(),
              _ = new Set(),
              O = () => {
                (w = Array.from(N.values())), _.forEach((E) => E());
              },
              j = (E) => {
                (m = E == null ? [] : m.filter((S) => S !== E)), O();
              },
              f = (E) => {
                const {
                    toastId: S,
                    onOpen: L,
                    updateId: k,
                    children: A,
                  } = E.props,
                  Te = k == null;
                E.staleId && N.delete(E.staleId),
                  N.set(S, E),
                  (m = [...m, E.props.toastId].filter(
                    (te) => te !== E.staleId
                  )),
                  O(),
                  p(Ls(E, Te ? "added" : "updated")),
                  Te && je(L) && L(y.isValidElement(A) && A.props);
              };
            return {
              id: d,
              props: T,
              observe: (E) => (_.add(E), () => _.delete(E)),
              toggle: (E, S) => {
                N.forEach((L) => {
                  (S != null && S !== L.props.toastId) ||
                    (je(L.toggle) && L.toggle(E));
                });
              },
              removeToast: j,
              toasts: N,
              clearQueue: () => {
                (v -= g.length), (g = []);
              },
              buildToast: (E, S) => {
                if (
                  ((Y) => {
                    let { containerId: K, toastId: ne, updateId: ie } = Y;
                    const me = K ? K !== d : d !== 1,
                      se = N.has(ne) && ie == null;
                    return me || se;
                  })(S)
                )
                  return;
                const {
                    toastId: L,
                    updateId: k,
                    data: A,
                    staleId: Te,
                    delay: te,
                  } = S,
                  Ce = () => {
                    j(L);
                  },
                  G = k == null;
                G && v++;
                const de = {
                  ...T,
                  style: T.toastStyle,
                  key: x++,
                  ...Object.fromEntries(
                    Object.entries(S).filter((Y) => {
                      let [K, ne] = Y;
                      return ne != null;
                    })
                  ),
                  toastId: L,
                  updateId: k,
                  data: A,
                  closeToast: Ce,
                  isIn: !1,
                  className: nn(S.className || T.toastClassName),
                  bodyClassName: nn(S.bodyClassName || T.bodyClassName),
                  progressClassName: nn(
                    S.progressClassName || T.progressClassName
                  ),
                  autoClose:
                    !S.isLoading &&
                    ((he = S.autoClose),
                    (ae = T.autoClose),
                    he === !1 || (Rt(he) && he > 0) ? he : ae),
                  deleteToast() {
                    const Y = N.get(L),
                      { onClose: K, children: ne } = Y.props;
                    je(K) && K(y.isValidElement(ne) && ne.props),
                      p(Ls(Y, "removed")),
                      N.delete(L),
                      v--,
                      v < 0 && (v = 0),
                      g.length > 0 ? f(g.shift()) : O();
                  },
                };
                var he, ae;
                (de.closeButton = T.closeButton),
                  S.closeButton === !1 || mr(S.closeButton)
                    ? (de.closeButton = S.closeButton)
                    : S.closeButton === !0 &&
                      (de.closeButton = !mr(T.closeButton) || T.closeButton);
                let z = E;
                y.isValidElement(E) && !et(E.type)
                  ? (z = y.cloneElement(E, {
                      closeToast: Ce,
                      toastProps: de,
                      data: A,
                    }))
                  : je(E) &&
                    (z = E({ closeToast: Ce, toastProps: de, data: A }));
                const re = { content: z, props: de, staleId: Te };
                T.limit && T.limit > 0 && v > T.limit && G
                  ? g.push(re)
                  : Rt(te)
                  ? setTimeout(() => {
                      f(re);
                    }, te)
                  : f(re);
              },
              setProps(E) {
                T = E;
              },
              setToggle: (E, S) => {
                N.get(E).toggle = S;
              },
              isToastActive: (E) => m.some((S) => S === E),
              getSnapshot: () => w,
            };
          })(o, a, Zc);
          fe.set(o, l);
          const u = l.observe(c);
          return (
            Pt.forEach((d) => Va(d.content, d.options)),
            (Pt = []),
            () => {
              u(), fe.delete(o);
            }
          );
        },
        setProps(c) {
          var l;
          (l = fe.get(o)) == null || l.setProps(c);
        },
        getSnapshot() {
          var c;
          return (c = fe.get(o)) == null ? void 0 : c.getSnapshot();
        },
      };
    })(e)
  ).current;
  r(e);
  const s = y.useSyncExternalStore(t, n, n);
  return {
    getToastToRender: function (a) {
      if (!s) return [];
      const o = new Map();
      return (
        e.newestOnTop && s.reverse(),
        s.forEach((c) => {
          const { position: l } = c.props;
          o.has(l) || o.set(l, []), o.get(l).push(c);
        }),
        Array.from(o, (c) => a(c[0], c[1]))
      );
    },
    isToastActive: Wa,
    count: s == null ? void 0 : s.length,
  };
}
function tl(e) {
  const [t, n] = y.useState(!1),
    [r, s] = y.useState(!1),
    a = y.useRef(null),
    o = y.useRef({
      start: 0,
      delta: 0,
      removalDistance: 0,
      canCloseOnClick: !0,
      canDrag: !1,
      didMove: !1,
    }).current,
    {
      autoClose: c,
      pauseOnHover: l,
      closeToast: u,
      onClick: d,
      closeOnClick: h,
    } = e;
  var p, x;
  function v() {
    n(!0);
  }
  function g() {
    n(!1);
  }
  function m(N) {
    const _ = a.current;
    o.canDrag &&
      _ &&
      ((o.didMove = !0),
      t && g(),
      (o.delta =
        e.draggableDirection === "x"
          ? N.clientX - o.start
          : N.clientY - o.start),
      o.start !== N.clientX && (o.canCloseOnClick = !1),
      (_.style.transform = `translate3d(${
        e.draggableDirection === "x"
          ? `${o.delta}px, var(--y)`
          : `0, calc(${o.delta}px + var(--y))`
      },0)`),
      (_.style.opacity = "" + (1 - Math.abs(o.delta / o.removalDistance))));
  }
  function w() {
    document.removeEventListener("pointermove", m),
      document.removeEventListener("pointerup", w);
    const N = a.current;
    if (o.canDrag && o.didMove && N) {
      if (((o.canDrag = !1), Math.abs(o.delta) > o.removalDistance))
        return s(!0), e.closeToast(), void e.collapseAll();
      (N.style.transition = "transform 0.2s, opacity 0.2s"),
        N.style.removeProperty("transform"),
        N.style.removeProperty("opacity");
    }
  }
  (x = fe.get(
    (p = { id: e.toastId, containerId: e.containerId, fn: n }).containerId || 1
  )) == null || x.setToggle(p.id, p.fn),
    y.useEffect(() => {
      if (e.pauseOnFocusLoss)
        return (
          document.hasFocus() || g(),
          window.addEventListener("focus", v),
          window.addEventListener("blur", g),
          () => {
            window.removeEventListener("focus", v),
              window.removeEventListener("blur", g);
          }
        );
    }, [e.pauseOnFocusLoss]);
  const T = {
    onPointerDown: function (N) {
      if (e.draggable === !0 || e.draggable === N.pointerType) {
        (o.didMove = !1),
          document.addEventListener("pointermove", m),
          document.addEventListener("pointerup", w);
        const _ = a.current;
        (o.canCloseOnClick = !0),
          (o.canDrag = !0),
          (_.style.transition = "none"),
          e.draggableDirection === "x"
            ? ((o.start = N.clientX),
              (o.removalDistance = _.offsetWidth * (e.draggablePercent / 100)))
            : ((o.start = N.clientY),
              (o.removalDistance =
                (_.offsetHeight *
                  (e.draggablePercent === 80
                    ? 1.5 * e.draggablePercent
                    : e.draggablePercent)) /
                100));
      }
    },
    onPointerUp: function (N) {
      const {
        top: _,
        bottom: O,
        left: j,
        right: f,
      } = a.current.getBoundingClientRect();
      N.nativeEvent.type !== "touchend" &&
      e.pauseOnHover &&
      N.clientX >= j &&
      N.clientX <= f &&
      N.clientY >= _ &&
      N.clientY <= O
        ? g()
        : v();
    },
  };
  return (
    c && l && ((T.onMouseEnter = g), e.stacked || (T.onMouseLeave = v)),
    h &&
      (T.onClick = (N) => {
        d && d(N), o.canCloseOnClick && u();
      }),
    {
      playToast: v,
      pauseToast: g,
      isRunning: t,
      preventExitTransition: r,
      toastRef: a,
      eventHandlers: T,
    }
  );
}
function nl(e) {
  let {
    delay: t,
    isRunning: n,
    closeToast: r,
    type: s = "default",
    hide: a,
    className: o,
    style: c,
    controlledProgress: l,
    progress: u,
    rtl: d,
    isIn: h,
    theme: p,
  } = e;
  const x = a || (l && u === 0),
    v = {
      ...c,
      animationDuration: `${t}ms`,
      animationPlayState: n ? "running" : "paused",
    };
  l && (v.transform = `scaleX(${u})`);
  const g = ke(
      "Toastify__progress-bar",
      l
        ? "Toastify__progress-bar--controlled"
        : "Toastify__progress-bar--animated",
      `Toastify__progress-bar-theme--${p}`,
      `Toastify__progress-bar--${s}`,
      { "Toastify__progress-bar--rtl": d }
    ),
    m = je(o) ? o({ rtl: d, type: s, defaultClassName: g }) : ke(g, o),
    w = {
      [l && u >= 1 ? "onTransitionEnd" : "onAnimationEnd"]:
        l && u < 1
          ? null
          : () => {
              h && r();
            },
    };
  return H.createElement(
    "div",
    { className: "Toastify__progress-bar--wrp", "data-hidden": x },
    H.createElement("div", {
      className: `Toastify__progress-bar--bg Toastify__progress-bar-theme--${p} Toastify__progress-bar--${s}`,
    }),
    H.createElement("div", {
      role: "progressbar",
      "aria-hidden": x ? "true" : "false",
      "aria-label": "notification timer",
      className: m,
      style: v,
      ...w,
    })
  );
}
let rl = 1;
const qa = () => "" + rl++;
function sl(e) {
  return e && (et(e.toastId) || Rt(e.toastId)) ? e.toastId : qa();
}
function Ot(e, t) {
  return Va(e, t), t.toastId;
}
function pn(e, t) {
  return { ...t, type: (t && t.type) || e, toastId: sl(t) };
}
function Gt(e) {
  return (t, n) => Ot(t, pn(e, n));
}
function P(e, t) {
  return Ot(e, pn("default", t));
}
(P.loading = (e, t) =>
  Ot(
    e,
    pn("default", {
      isLoading: !0,
      autoClose: !1,
      closeOnClick: !1,
      closeButton: !1,
      draggable: !1,
      ...t,
    })
  )),
  (P.promise = function (e, t, n) {
    let r,
      { pending: s, error: a, success: o } = t;
    s && (r = et(s) ? P.loading(s, n) : P.loading(s.render, { ...n, ...s }));
    const c = {
        isLoading: null,
        autoClose: null,
        closeOnClick: null,
        closeButton: null,
        draggable: null,
      },
      l = (d, h, p) => {
        if (h == null) return void P.dismiss(r);
        const x = { type: d, ...c, ...n, data: p },
          v = et(h) ? { render: h } : h;
        return r ? P.update(r, { ...x, ...v }) : P(v.render, { ...x, ...v }), p;
      },
      u = je(e) ? e() : e;
    return u.then((d) => l("success", o, d)).catch((d) => l("error", a, d)), u;
  }),
  (P.success = Gt("success")),
  (P.info = Gt("info")),
  (P.error = Gt("error")),
  (P.warning = Gt("warning")),
  (P.warn = P.warning),
  (P.dark = (e, t) => Ot(e, pn("default", { theme: "dark", ...t }))),
  (P.dismiss = function (e) {
    (function (t) {
      var n;
      if ($a()) {
        if (t == null || et((n = t)) || Rt(n))
          fe.forEach((r) => {
            r.removeToast(t);
          });
        else if (t && ("containerId" in t || "id" in t)) {
          const r = fe.get(t.containerId);
          r
            ? r.removeToast(t.id)
            : fe.forEach((s) => {
                s.removeToast(t.id);
              });
        }
      } else Pt = Pt.filter((r) => t != null && r.options.toastId !== t);
    })(e);
  }),
  (P.clearWaitingQueue = function (e) {
    e === void 0 && (e = {}),
      fe.forEach((t) => {
        !t.props.limit ||
          (e.containerId && t.id !== e.containerId) ||
          t.clearQueue();
      });
  }),
  (P.isActive = Wa),
  (P.update = function (e, t) {
    t === void 0 && (t = {});
    const n = ((r, s) => {
      var a;
      let { containerId: o } = s;
      return (a = fe.get(o || 1)) == null ? void 0 : a.toasts.get(r);
    })(e, t);
    if (n) {
      const { props: r, content: s } = n,
        a = { delay: 100, ...r, ...t, toastId: t.toastId || e, updateId: qa() };
      a.toastId !== e && (a.staleId = e);
      const o = a.render || s;
      delete a.render, Ot(o, a);
    }
  }),
  (P.done = (e) => {
    P.update(e, { progress: 1 });
  }),
  (P.onChange = function (e) {
    return (
      pr.add(e),
      () => {
        pr.delete(e);
      }
    );
  }),
  (P.play = (e) => Is(!0, e)),
  (P.pause = (e) => Is(!1, e));
const al = typeof window < "u" ? y.useLayoutEffect : y.useEffect,
  Kt = (e) => {
    let { theme: t, type: n, isLoading: r, ...s } = e;
    return H.createElement("svg", {
      viewBox: "0 0 24 24",
      width: "100%",
      height: "100%",
      fill:
        t === "colored" ? "currentColor" : `var(--toastify-icon-color-${n})`,
      ...s,
    });
  },
  Gn = {
    info: function (e) {
      return H.createElement(
        Kt,
        { ...e },
        H.createElement("path", {
          d: "M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z",
        })
      );
    },
    warning: function (e) {
      return H.createElement(
        Kt,
        { ...e },
        H.createElement("path", {
          d: "M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z",
        })
      );
    },
    success: function (e) {
      return H.createElement(
        Kt,
        { ...e },
        H.createElement("path", {
          d: "M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z",
        })
      );
    },
    error: function (e) {
      return H.createElement(
        Kt,
        { ...e },
        H.createElement("path", {
          d: "M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z",
        })
      );
    },
    spinner: function () {
      return H.createElement("div", { className: "Toastify__spinner" });
    },
  },
  il = (e) => {
    const {
        isRunning: t,
        preventExitTransition: n,
        toastRef: r,
        eventHandlers: s,
        playToast: a,
      } = tl(e),
      {
        closeButton: o,
        children: c,
        autoClose: l,
        onClick: u,
        type: d,
        hideProgressBar: h,
        closeToast: p,
        transition: x,
        position: v,
        className: g,
        style: m,
        bodyClassName: w,
        bodyStyle: T,
        progressClassName: N,
        progressStyle: _,
        updateId: O,
        role: j,
        progress: f,
        rtl: E,
        toastId: S,
        deleteToast: L,
        isIn: k,
        isLoading: A,
        closeOnClick: Te,
        theme: te,
      } = e,
      Ce = ke(
        "Toastify__toast",
        `Toastify__toast-theme--${te}`,
        `Toastify__toast--${d}`,
        { "Toastify__toast--rtl": E },
        { "Toastify__toast--close-on-click": Te }
      ),
      G = je(g)
        ? g({ rtl: E, position: v, type: d, defaultClassName: Ce })
        : ke(Ce, g),
      de = (function (re) {
        let { theme: Y, type: K, isLoading: ne, icon: ie } = re,
          me = null;
        const se = { theme: Y, type: K };
        return (
          ie === !1 ||
            (je(ie)
              ? (me = ie({ ...se, isLoading: ne }))
              : y.isValidElement(ie)
              ? (me = y.cloneElement(ie, se))
              : ne
              ? (me = Gn.spinner())
              : ((Pe) => Pe in Gn)(K) && (me = Gn[K](se))),
          me
        );
      })(e),
      he = !!f || !l,
      ae = { closeToast: p, type: d, theme: te };
    let z = null;
    return (
      o === !1 ||
        (z = je(o)
          ? o(ae)
          : y.isValidElement(o)
          ? y.cloneElement(o, ae)
          : (function (re) {
              let { closeToast: Y, theme: K, ariaLabel: ne = "close" } = re;
              return H.createElement(
                "button",
                {
                  className: `Toastify__close-button Toastify__close-button--${K}`,
                  type: "button",
                  onClick: (ie) => {
                    ie.stopPropagation(), Y(ie);
                  },
                  "aria-label": ne,
                },
                H.createElement(
                  "svg",
                  { "aria-hidden": "true", viewBox: "0 0 14 16" },
                  H.createElement("path", {
                    fillRule: "evenodd",
                    d: "M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z",
                  })
                )
              );
            })(ae)),
      H.createElement(
        x,
        {
          isIn: k,
          done: L,
          position: v,
          preventExitTransition: n,
          nodeRef: r,
          playToast: a,
        },
        H.createElement(
          "div",
          {
            id: S,
            onClick: u,
            "data-in": k,
            className: G,
            ...s,
            style: m,
            ref: r,
          },
          H.createElement(
            "div",
            {
              ...(k && { role: j }),
              className: je(w) ? w({ type: d }) : ke("Toastify__toast-body", w),
              style: T,
            },
            de != null &&
              H.createElement(
                "div",
                {
                  className: ke("Toastify__toast-icon", {
                    "Toastify--animate-icon Toastify__zoom-enter": !A,
                  }),
                },
                de
              ),
            H.createElement("div", null, c)
          ),
          z,
          H.createElement(nl, {
            ...(O && !he ? { key: `pb-${O}` } : {}),
            rtl: E,
            theme: te,
            delay: l,
            isRunning: t,
            isIn: k,
            closeToast: p,
            hide: h,
            type: d,
            style: _,
            className: N,
            controlledProgress: he,
            progress: f || 0,
          })
        )
      )
    );
  },
  En = function (e, t) {
    return (
      t === void 0 && (t = !1),
      {
        enter: `Toastify--animate Toastify__${e}-enter`,
        exit: `Toastify--animate Toastify__${e}-exit`,
        appendPosition: t,
      }
    );
  },
  ol = Nn(En("bounce", !0));
Nn(En("slide", !0));
Nn(En("zoom"));
Nn(En("flip"));
const cl = {
  position: "top-right",
  transition: ol,
  autoClose: 5e3,
  closeButton: !0,
  pauseOnHover: !0,
  pauseOnFocusLoss: !0,
  draggable: "touch",
  draggablePercent: 80,
  draggableDirection: "x",
  role: "alert",
  theme: "light",
};
function ll(e) {
  let t = { ...cl, ...e };
  const n = e.stacked,
    [r, s] = y.useState(!0),
    a = y.useRef(null),
    { getToastToRender: o, isToastActive: c, count: l } = el(t),
    { className: u, style: d, rtl: h, containerId: p } = t;
  function x(g) {
    const m = ke(
      "Toastify__toast-container",
      `Toastify__toast-container--${g}`,
      { "Toastify__toast-container--rtl": h }
    );
    return je(u)
      ? u({ position: g, rtl: h, defaultClassName: m })
      : ke(m, nn(u));
  }
  function v() {
    n && (s(!0), P.play());
  }
  return (
    al(() => {
      if (n) {
        var g;
        const m = a.current.querySelectorAll('[data-in="true"]'),
          w = 12,
          T = (g = t.position) == null ? void 0 : g.includes("top");
        let N = 0,
          _ = 0;
        Array.from(m)
          .reverse()
          .forEach((O, j) => {
            const f = O;
            f.classList.add("Toastify__toast--stacked"),
              j > 0 && (f.dataset.collapsed = `${r}`),
              f.dataset.pos || (f.dataset.pos = T ? "top" : "bot");
            const E = N * (r ? 0.2 : 1) + (r ? 0 : w * j);
            f.style.setProperty("--y", `${T ? E : -1 * E}px`),
              f.style.setProperty("--g", `${w}`),
              f.style.setProperty("--s", "" + (1 - (r ? _ : 0))),
              (N += f.offsetHeight),
              (_ += 0.025);
          });
      }
    }, [r, l, n]),
    H.createElement(
      "div",
      {
        ref: a,
        className: "Toastify",
        id: p,
        onMouseEnter: () => {
          n && (s(!1), P.pause());
        },
        onMouseLeave: v,
      },
      o((g, m) => {
        const w = m.length ? { ...d } : { ...d, pointerEvents: "none" };
        return H.createElement(
          "div",
          { className: x(g), style: w, key: `container-${g}` },
          m.map((T) => {
            let { content: N, props: _ } = T;
            return H.createElement(
              il,
              {
                ..._,
                stacked: n,
                collapseAll: v,
                isIn: c(_.toastId, _.containerId),
                style: _.style,
                key: `toast-${_.key}`,
              },
              N
            );
          })
        );
      })
    )
  );
}
function Ya(e, t) {
  return function () {
    return e.apply(t, arguments);
  };
}
const { toString: ul } = Object.prototype,
  { getPrototypeOf: Gr } = Object,
  { iterator: Tn, toStringTag: Xa } = Symbol,
  Sn = ((e) => (t) => {
    const n = ul.call(t);
    return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
  })(Object.create(null)),
  Be = (e) => ((e = e.toLowerCase()), (t) => Sn(t) === e),
  jn = (e) => (t) => typeof t === e,
  { isArray: yt } = Array,
  Dt = jn("undefined");
function dl(e) {
  return (
    e !== null &&
    !Dt(e) &&
    e.constructor !== null &&
    !Dt(e.constructor) &&
    be(e.constructor.isBuffer) &&
    e.constructor.isBuffer(e)
  );
}
const Ja = Be("ArrayBuffer");
function hl(e) {
  let t;
  return (
    typeof ArrayBuffer < "u" && ArrayBuffer.isView
      ? (t = ArrayBuffer.isView(e))
      : (t = e && e.buffer && Ja(e.buffer)),
    t
  );
}
const fl = jn("string"),
  be = jn("function"),
  Ga = jn("number"),
  _n = (e) => e !== null && typeof e == "object",
  ml = (e) => e === !0 || e === !1,
  rn = (e) => {
    if (Sn(e) !== "object") return !1;
    const t = Gr(e);
    return (
      (t === null ||
        t === Object.prototype ||
        Object.getPrototypeOf(t) === null) &&
      !(Xa in e) &&
      !(Tn in e)
    );
  },
  pl = Be("Date"),
  gl = Be("File"),
  yl = Be("Blob"),
  vl = Be("FileList"),
  xl = (e) => _n(e) && be(e.pipe),
  bl = (e) => {
    let t;
    return (
      e &&
      ((typeof FormData == "function" && e instanceof FormData) ||
        (be(e.append) &&
          ((t = Sn(e)) === "formdata" ||
            (t === "object" &&
              be(e.toString) &&
              e.toString() === "[object FormData]"))))
    );
  },
  wl = Be("URLSearchParams"),
  [Nl, El, Tl, Sl] = ["ReadableStream", "Request", "Response", "Headers"].map(
    Be
  ),
  jl = (e) =>
    e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Ht(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u") return;
  let r, s;
  if ((typeof e != "object" && (e = [e]), yt(e)))
    for (r = 0, s = e.length; r < s; r++) t.call(null, e[r], r, e);
  else {
    const a = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
      o = a.length;
    let c;
    for (r = 0; r < o; r++) (c = a[r]), t.call(null, e[c], c, e);
  }
}
function Ka(e, t) {
  t = t.toLowerCase();
  const n = Object.keys(e);
  let r = n.length,
    s;
  for (; r-- > 0; ) if (((s = n[r]), t === s.toLowerCase())) return s;
  return null;
}
const Ze =
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
      ? self
      : typeof window < "u"
      ? window
      : global,
  Qa = (e) => !Dt(e) && e !== Ze;
function gr() {
  const { caseless: e } = (Qa(this) && this) || {},
    t = {},
    n = (r, s) => {
      const a = (e && Ka(t, s)) || s;
      rn(t[a]) && rn(r)
        ? (t[a] = gr(t[a], r))
        : rn(r)
        ? (t[a] = gr({}, r))
        : yt(r)
        ? (t[a] = r.slice())
        : (t[a] = r);
    };
  for (let r = 0, s = arguments.length; r < s; r++)
    arguments[r] && Ht(arguments[r], n);
  return t;
}
const _l = (e, t, n, { allOwnKeys: r } = {}) => (
    Ht(
      t,
      (s, a) => {
        n && be(s) ? (e[a] = Ya(s, n)) : (e[a] = s);
      },
      { allOwnKeys: r }
    ),
    e
  ),
  Cl = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
  Ol = (e, t, n, r) => {
    (e.prototype = Object.create(t.prototype, r)),
      (e.prototype.constructor = e),
      Object.defineProperty(e, "super", { value: t.prototype }),
      n && Object.assign(e.prototype, n);
  },
  Al = (e, t, n, r) => {
    let s, a, o;
    const c = {};
    if (((t = t || {}), e == null)) return t;
    do {
      for (s = Object.getOwnPropertyNames(e), a = s.length; a-- > 0; )
        (o = s[a]), (!r || r(o, e, t)) && !c[o] && ((t[o] = e[o]), (c[o] = !0));
      e = n !== !1 && Gr(e);
    } while (e && (!n || n(e, t)) && e !== Object.prototype);
    return t;
  },
  kl = (e, t, n) => {
    (e = String(e)),
      (n === void 0 || n > e.length) && (n = e.length),
      (n -= t.length);
    const r = e.indexOf(t, n);
    return r !== -1 && r === n;
  },
  Rl = (e) => {
    if (!e) return null;
    if (yt(e)) return e;
    let t = e.length;
    if (!Ga(t)) return null;
    const n = new Array(t);
    for (; t-- > 0; ) n[t] = e[t];
    return n;
  },
  Pl = (
    (e) => (t) =>
      e && t instanceof e
  )(typeof Uint8Array < "u" && Gr(Uint8Array)),
  Dl = (e, t) => {
    const r = (e && e[Tn]).call(e);
    let s;
    for (; (s = r.next()) && !s.done; ) {
      const a = s.value;
      t.call(e, a[0], a[1]);
    }
  },
  Ll = (e, t) => {
    let n;
    const r = [];
    for (; (n = e.exec(t)) !== null; ) r.push(n);
    return r;
  },
  Il = Be("HTMLFormElement"),
  Ml = (e) =>
    e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (n, r, s) {
      return r.toUpperCase() + s;
    }),
  Ms = (
    ({ hasOwnProperty: e }) =>
    (t, n) =>
      e.call(t, n)
  )(Object.prototype),
  Bl = Be("RegExp"),
  Za = (e, t) => {
    const n = Object.getOwnPropertyDescriptors(e),
      r = {};
    Ht(n, (s, a) => {
      let o;
      (o = t(s, a, e)) !== !1 && (r[a] = o || s);
    }),
      Object.defineProperties(e, r);
  },
  Fl = (e) => {
    Za(e, (t, n) => {
      if (be(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1)
        return !1;
      const r = e[n];
      if (be(r)) {
        if (((t.enumerable = !1), "writable" in t)) {
          t.writable = !1;
          return;
        }
        t.set ||
          (t.set = () => {
            throw Error("Can not rewrite read-only method '" + n + "'");
          });
      }
    });
  },
  Hl = (e, t) => {
    const n = {},
      r = (s) => {
        s.forEach((a) => {
          n[a] = !0;
        });
      };
    return yt(e) ? r(e) : r(String(e).split(t)), n;
  },
  Ul = () => {},
  zl = (e, t) => (e != null && Number.isFinite((e = +e)) ? e : t);
function $l(e) {
  return !!(e && be(e.append) && e[Xa] === "FormData" && e[Tn]);
}
const Wl = (e) => {
    const t = new Array(10),
      n = (r, s) => {
        if (_n(r)) {
          if (t.indexOf(r) >= 0) return;
          if (!("toJSON" in r)) {
            t[s] = r;
            const a = yt(r) ? [] : {};
            return (
              Ht(r, (o, c) => {
                const l = n(o, s + 1);
                !Dt(l) && (a[c] = l);
              }),
              (t[s] = void 0),
              a
            );
          }
        }
        return r;
      };
    return n(e, 0);
  },
  Vl = Be("AsyncFunction"),
  ql = (e) => e && (_n(e) || be(e)) && be(e.then) && be(e.catch),
  ei = ((e, t) =>
    e
      ? setImmediate
      : t
      ? ((n, r) => (
          Ze.addEventListener(
            "message",
            ({ source: s, data: a }) => {
              s === Ze && a === n && r.length && r.shift()();
            },
            !1
          ),
          (s) => {
            r.push(s), Ze.postMessage(n, "*");
          }
        ))(`axios@${Math.random()}`, [])
      : (n) => setTimeout(n))(
    typeof setImmediate == "function",
    be(Ze.postMessage)
  ),
  Yl =
    typeof queueMicrotask < "u"
      ? queueMicrotask.bind(Ze)
      : (typeof process < "u" && process.nextTick) || ei,
  Xl = (e) => e != null && be(e[Tn]),
  b = {
    isArray: yt,
    isArrayBuffer: Ja,
    isBuffer: dl,
    isFormData: bl,
    isArrayBufferView: hl,
    isString: fl,
    isNumber: Ga,
    isBoolean: ml,
    isObject: _n,
    isPlainObject: rn,
    isReadableStream: Nl,
    isRequest: El,
    isResponse: Tl,
    isHeaders: Sl,
    isUndefined: Dt,
    isDate: pl,
    isFile: gl,
    isBlob: yl,
    isRegExp: Bl,
    isFunction: be,
    isStream: xl,
    isURLSearchParams: wl,
    isTypedArray: Pl,
    isFileList: vl,
    forEach: Ht,
    merge: gr,
    extend: _l,
    trim: jl,
    stripBOM: Cl,
    inherits: Ol,
    toFlatObject: Al,
    kindOf: Sn,
    kindOfTest: Be,
    endsWith: kl,
    toArray: Rl,
    forEachEntry: Dl,
    matchAll: Ll,
    isHTMLForm: Il,
    hasOwnProperty: Ms,
    hasOwnProp: Ms,
    reduceDescriptors: Za,
    freezeMethods: Fl,
    toObjectSet: Hl,
    toCamelCase: Ml,
    noop: Ul,
    toFiniteNumber: zl,
    findKey: Ka,
    global: Ze,
    isContextDefined: Qa,
    isSpecCompliantForm: $l,
    toJSONObject: Wl,
    isAsyncFn: Vl,
    isThenable: ql,
    setImmediate: ei,
    asap: Yl,
    isIterable: Xl,
  };
function I(e, t, n, r, s) {
  Error.call(this),
    Error.captureStackTrace
      ? Error.captureStackTrace(this, this.constructor)
      : (this.stack = new Error().stack),
    (this.message = e),
    (this.name = "AxiosError"),
    t && (this.code = t),
    n && (this.config = n),
    r && (this.request = r),
    s && ((this.response = s), (this.status = s.status ? s.status : null));
}
b.inherits(I, Error, {
  toJSON: function () {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: b.toJSONObject(this.config),
      code: this.code,
      status: this.status,
    };
  },
});
const ti = I.prototype,
  ni = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL",
].forEach((e) => {
  ni[e] = { value: e };
});
Object.defineProperties(I, ni);
Object.defineProperty(ti, "isAxiosError", { value: !0 });
I.from = (e, t, n, r, s, a) => {
  const o = Object.create(ti);
  return (
    b.toFlatObject(
      e,
      o,
      function (l) {
        return l !== Error.prototype;
      },
      (c) => c !== "isAxiosError"
    ),
    I.call(o, e.message, t, n, r, s),
    (o.cause = e),
    (o.name = e.name),
    a && Object.assign(o, a),
    o
  );
};
const Jl = null;
function yr(e) {
  return b.isPlainObject(e) || b.isArray(e);
}
function ri(e) {
  return b.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Bs(e, t, n) {
  return e
    ? e
        .concat(t)
        .map(function (s, a) {
          return (s = ri(s)), !n && a ? "[" + s + "]" : s;
        })
        .join(n ? "." : "")
    : t;
}
function Gl(e) {
  return b.isArray(e) && !e.some(yr);
}
const Kl = b.toFlatObject(b, {}, null, function (t) {
  return /^is[A-Z]/.test(t);
});
function Cn(e, t, n) {
  if (!b.isObject(e)) throw new TypeError("target must be an object");
  (t = t || new FormData()),
    (n = b.toFlatObject(
      n,
      { metaTokens: !0, dots: !1, indexes: !1 },
      !1,
      function (g, m) {
        return !b.isUndefined(m[g]);
      }
    ));
  const r = n.metaTokens,
    s = n.visitor || d,
    a = n.dots,
    o = n.indexes,
    l = (n.Blob || (typeof Blob < "u" && Blob)) && b.isSpecCompliantForm(t);
  if (!b.isFunction(s)) throw new TypeError("visitor must be a function");
  function u(v) {
    if (v === null) return "";
    if (b.isDate(v)) return v.toISOString();
    if (b.isBoolean(v)) return v.toString();
    if (!l && b.isBlob(v))
      throw new I("Blob is not supported. Use a Buffer instead.");
    return b.isArrayBuffer(v) || b.isTypedArray(v)
      ? l && typeof Blob == "function"
        ? new Blob([v])
        : Buffer.from(v)
      : v;
  }
  function d(v, g, m) {
    let w = v;
    if (v && !m && typeof v == "object") {
      if (b.endsWith(g, "{}"))
        (g = r ? g : g.slice(0, -2)), (v = JSON.stringify(v));
      else if (
        (b.isArray(v) && Gl(v)) ||
        ((b.isFileList(v) || b.endsWith(g, "[]")) && (w = b.toArray(v)))
      )
        return (
          (g = ri(g)),
          w.forEach(function (N, _) {
            !(b.isUndefined(N) || N === null) &&
              t.append(
                o === !0 ? Bs([g], _, a) : o === null ? g : g + "[]",
                u(N)
              );
          }),
          !1
        );
    }
    return yr(v) ? !0 : (t.append(Bs(m, g, a), u(v)), !1);
  }
  const h = [],
    p = Object.assign(Kl, {
      defaultVisitor: d,
      convertValue: u,
      isVisitable: yr,
    });
  function x(v, g) {
    if (!b.isUndefined(v)) {
      if (h.indexOf(v) !== -1)
        throw Error("Circular reference detected in " + g.join("."));
      h.push(v),
        b.forEach(v, function (w, T) {
          (!(b.isUndefined(w) || w === null) &&
            s.call(t, w, b.isString(T) ? T.trim() : T, g, p)) === !0 &&
            x(w, g ? g.concat(T) : [T]);
        }),
        h.pop();
    }
  }
  if (!b.isObject(e)) throw new TypeError("data must be an object");
  return x(e), t;
}
function Fs(e) {
  const t = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0",
  };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (r) {
    return t[r];
  });
}
function Kr(e, t) {
  (this._pairs = []), e && Cn(e, this, t);
}
const si = Kr.prototype;
si.append = function (t, n) {
  this._pairs.push([t, n]);
};
si.toString = function (t) {
  const n = t
    ? function (r) {
        return t.call(this, r, Fs);
      }
    : Fs;
  return this._pairs
    .map(function (s) {
      return n(s[0]) + "=" + n(s[1]);
    }, "")
    .join("&");
};
function Ql(e) {
  return encodeURIComponent(e)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}
function ai(e, t, n) {
  if (!t) return e;
  const r = (n && n.encode) || Ql;
  b.isFunction(n) && (n = { serialize: n });
  const s = n && n.serialize;
  let a;
  if (
    (s
      ? (a = s(t, n))
      : (a = b.isURLSearchParams(t) ? t.toString() : new Kr(t, n).toString(r)),
    a)
  ) {
    const o = e.indexOf("#");
    o !== -1 && (e = e.slice(0, o)),
      (e += (e.indexOf("?") === -1 ? "?" : "&") + a);
  }
  return e;
}
class Hs {
  constructor() {
    this.handlers = [];
  }
  use(t, n, r) {
    return (
      this.handlers.push({
        fulfilled: t,
        rejected: n,
        synchronous: r ? r.synchronous : !1,
        runWhen: r ? r.runWhen : null,
      }),
      this.handlers.length - 1
    );
  }
  eject(t) {
    this.handlers[t] && (this.handlers[t] = null);
  }
  clear() {
    this.handlers && (this.handlers = []);
  }
  forEach(t) {
    b.forEach(this.handlers, function (r) {
      r !== null && t(r);
    });
  }
}
const ii = {
    silentJSONParsing: !0,
    forcedJSONParsing: !0,
    clarifyTimeoutError: !1,
  },
  Zl = typeof URLSearchParams < "u" ? URLSearchParams : Kr,
  eu = typeof FormData < "u" ? FormData : null,
  tu = typeof Blob < "u" ? Blob : null,
  nu = {
    isBrowser: !0,
    classes: { URLSearchParams: Zl, FormData: eu, Blob: tu },
    protocols: ["http", "https", "file", "blob", "url", "data"],
  },
  Qr = typeof window < "u" && typeof document < "u",
  vr = (typeof navigator == "object" && navigator) || void 0,
  ru =
    Qr &&
    (!vr || ["ReactNative", "NativeScript", "NS"].indexOf(vr.product) < 0),
  su =
    typeof WorkerGlobalScope < "u" &&
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts == "function",
  au = (Qr && window.location.href) || "http://localhost",
  iu = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        hasBrowserEnv: Qr,
        hasStandardBrowserEnv: ru,
        hasStandardBrowserWebWorkerEnv: su,
        navigator: vr,
        origin: au,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  ue = { ...iu, ...nu };
function ou(e, t) {
  return Cn(
    e,
    new ue.classes.URLSearchParams(),
    Object.assign(
      {
        visitor: function (n, r, s, a) {
          return ue.isNode && b.isBuffer(n)
            ? (this.append(r, n.toString("base64")), !1)
            : a.defaultVisitor.apply(this, arguments);
        },
      },
      t
    )
  );
}
function cu(e) {
  return b
    .matchAll(/\w+|\[(\w*)]/g, e)
    .map((t) => (t[0] === "[]" ? "" : t[1] || t[0]));
}
function lu(e) {
  const t = {},
    n = Object.keys(e);
  let r;
  const s = n.length;
  let a;
  for (r = 0; r < s; r++) (a = n[r]), (t[a] = e[a]);
  return t;
}
function oi(e) {
  function t(n, r, s, a) {
    let o = n[a++];
    if (o === "__proto__") return !0;
    const c = Number.isFinite(+o),
      l = a >= n.length;
    return (
      (o = !o && b.isArray(s) ? s.length : o),
      l
        ? (b.hasOwnProp(s, o) ? (s[o] = [s[o], r]) : (s[o] = r), !c)
        : ((!s[o] || !b.isObject(s[o])) && (s[o] = []),
          t(n, r, s[o], a) && b.isArray(s[o]) && (s[o] = lu(s[o])),
          !c)
    );
  }
  if (b.isFormData(e) && b.isFunction(e.entries)) {
    const n = {};
    return (
      b.forEachEntry(e, (r, s) => {
        t(cu(r), s, n, 0);
      }),
      n
    );
  }
  return null;
}
function uu(e, t, n) {
  if (b.isString(e))
    try {
      return (t || JSON.parse)(e), b.trim(e);
    } catch (r) {
      if (r.name !== "SyntaxError") throw r;
    }
  return (n || JSON.stringify)(e);
}
const Ut = {
  transitional: ii,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [
    function (t, n) {
      const r = n.getContentType() || "",
        s = r.indexOf("application/json") > -1,
        a = b.isObject(t);
      if ((a && b.isHTMLForm(t) && (t = new FormData(t)), b.isFormData(t)))
        return s ? JSON.stringify(oi(t)) : t;
      if (
        b.isArrayBuffer(t) ||
        b.isBuffer(t) ||
        b.isStream(t) ||
        b.isFile(t) ||
        b.isBlob(t) ||
        b.isReadableStream(t)
      )
        return t;
      if (b.isArrayBufferView(t)) return t.buffer;
      if (b.isURLSearchParams(t))
        return (
          n.setContentType(
            "application/x-www-form-urlencoded;charset=utf-8",
            !1
          ),
          t.toString()
        );
      let c;
      if (a) {
        if (r.indexOf("application/x-www-form-urlencoded") > -1)
          return ou(t, this.formSerializer).toString();
        if ((c = b.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
          const l = this.env && this.env.FormData;
          return Cn(
            c ? { "files[]": t } : t,
            l && new l(),
            this.formSerializer
          );
        }
      }
      return a || s ? (n.setContentType("application/json", !1), uu(t)) : t;
    },
  ],
  transformResponse: [
    function (t) {
      const n = this.transitional || Ut.transitional,
        r = n && n.forcedJSONParsing,
        s = this.responseType === "json";
      if (b.isResponse(t) || b.isReadableStream(t)) return t;
      if (t && b.isString(t) && ((r && !this.responseType) || s)) {
        const o = !(n && n.silentJSONParsing) && s;
        try {
          return JSON.parse(t);
        } catch (c) {
          if (o)
            throw c.name === "SyntaxError"
              ? I.from(c, I.ERR_BAD_RESPONSE, this, null, this.response)
              : c;
        }
      }
      return t;
    },
  ],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: ue.classes.FormData, Blob: ue.classes.Blob },
  validateStatus: function (t) {
    return t >= 200 && t < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0,
    },
  },
};
b.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
  Ut.headers[e] = {};
});
const du = b.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent",
  ]),
  hu = (e) => {
    const t = {};
    let n, r, s;
    return (
      e &&
        e
          .split(
            `
`
          )
          .forEach(function (o) {
            (s = o.indexOf(":")),
              (n = o.substring(0, s).trim().toLowerCase()),
              (r = o.substring(s + 1).trim()),
              !(!n || (t[n] && du[n])) &&
                (n === "set-cookie"
                  ? t[n]
                    ? t[n].push(r)
                    : (t[n] = [r])
                  : (t[n] = t[n] ? t[n] + ", " + r : r));
          }),
      t
    );
  },
  Us = Symbol("internals");
function Et(e) {
  return e && String(e).trim().toLowerCase();
}
function sn(e) {
  return e === !1 || e == null ? e : b.isArray(e) ? e.map(sn) : String(e);
}
function fu(e) {
  const t = Object.create(null),
    n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; (r = n.exec(e)); ) t[r[1]] = r[2];
  return t;
}
const mu = (e) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());
function Kn(e, t, n, r, s) {
  if (b.isFunction(r)) return r.call(this, t, n);
  if ((s && (t = n), !!b.isString(t))) {
    if (b.isString(r)) return t.indexOf(r) !== -1;
    if (b.isRegExp(r)) return r.test(t);
  }
}
function pu(e) {
  return e
    .trim()
    .toLowerCase()
    .replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
}
function gu(e, t) {
  const n = b.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((r) => {
    Object.defineProperty(e, r + n, {
      value: function (s, a, o) {
        return this[r].call(this, t, s, a, o);
      },
      configurable: !0,
    });
  });
}
let we = class {
  constructor(t) {
    t && this.set(t);
  }
  set(t, n, r) {
    const s = this;
    function a(c, l, u) {
      const d = Et(l);
      if (!d) throw new Error("header name must be a non-empty string");
      const h = b.findKey(s, d);
      (!h || s[h] === void 0 || u === !0 || (u === void 0 && s[h] !== !1)) &&
        (s[h || l] = sn(c));
    }
    const o = (c, l) => b.forEach(c, (u, d) => a(u, d, l));
    if (b.isPlainObject(t) || t instanceof this.constructor) o(t, n);
    else if (b.isString(t) && (t = t.trim()) && !mu(t)) o(hu(t), n);
    else if (b.isObject(t) && b.isIterable(t)) {
      let c = {},
        l,
        u;
      for (const d of t) {
        if (!b.isArray(d))
          throw TypeError("Object iterator must return a key-value pair");
        c[(u = d[0])] = (l = c[u])
          ? b.isArray(l)
            ? [...l, d[1]]
            : [l, d[1]]
          : d[1];
      }
      o(c, n);
    } else t != null && a(n, t, r);
    return this;
  }
  get(t, n) {
    if (((t = Et(t)), t)) {
      const r = b.findKey(this, t);
      if (r) {
        const s = this[r];
        if (!n) return s;
        if (n === !0) return fu(s);
        if (b.isFunction(n)) return n.call(this, s, r);
        if (b.isRegExp(n)) return n.exec(s);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(t, n) {
    if (((t = Et(t)), t)) {
      const r = b.findKey(this, t);
      return !!(r && this[r] !== void 0 && (!n || Kn(this, this[r], r, n)));
    }
    return !1;
  }
  delete(t, n) {
    const r = this;
    let s = !1;
    function a(o) {
      if (((o = Et(o)), o)) {
        const c = b.findKey(r, o);
        c && (!n || Kn(r, r[c], c, n)) && (delete r[c], (s = !0));
      }
    }
    return b.isArray(t) ? t.forEach(a) : a(t), s;
  }
  clear(t) {
    const n = Object.keys(this);
    let r = n.length,
      s = !1;
    for (; r--; ) {
      const a = n[r];
      (!t || Kn(this, this[a], a, t, !0)) && (delete this[a], (s = !0));
    }
    return s;
  }
  normalize(t) {
    const n = this,
      r = {};
    return (
      b.forEach(this, (s, a) => {
        const o = b.findKey(r, a);
        if (o) {
          (n[o] = sn(s)), delete n[a];
          return;
        }
        const c = t ? pu(a) : String(a).trim();
        c !== a && delete n[a], (n[c] = sn(s)), (r[c] = !0);
      }),
      this
    );
  }
  concat(...t) {
    return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
    const n = Object.create(null);
    return (
      b.forEach(this, (r, s) => {
        r != null && r !== !1 && (n[s] = t && b.isArray(r) ? r.join(", ") : r);
      }),
      n
    );
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(t) {
    return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
    const r = new this(t);
    return n.forEach((s) => r.set(s)), r;
  }
  static accessor(t) {
    const r = (this[Us] = this[Us] = { accessors: {} }).accessors,
      s = this.prototype;
    function a(o) {
      const c = Et(o);
      r[c] || (gu(s, o), (r[c] = !0));
    }
    return b.isArray(t) ? t.forEach(a) : a(t), this;
  }
};
we.accessor([
  "Content-Type",
  "Content-Length",
  "Accept",
  "Accept-Encoding",
  "User-Agent",
  "Authorization",
]);
b.reduceDescriptors(we.prototype, ({ value: e }, t) => {
  let n = t[0].toUpperCase() + t.slice(1);
  return {
    get: () => e,
    set(r) {
      this[n] = r;
    },
  };
});
b.freezeMethods(we);
function Qn(e, t) {
  const n = this || Ut,
    r = t || n,
    s = we.from(r.headers);
  let a = r.data;
  return (
    b.forEach(e, function (c) {
      a = c.call(n, a, s.normalize(), t ? t.status : void 0);
    }),
    s.normalize(),
    a
  );
}
function ci(e) {
  return !!(e && e.__CANCEL__);
}
function vt(e, t, n) {
  I.call(this, e ?? "canceled", I.ERR_CANCELED, t, n),
    (this.name = "CanceledError");
}
b.inherits(vt, I, { __CANCEL__: !0 });
function li(e, t, n) {
  const r = n.config.validateStatus;
  !n.status || !r || r(n.status)
    ? e(n)
    : t(
        new I(
          "Request failed with status code " + n.status,
          [I.ERR_BAD_REQUEST, I.ERR_BAD_RESPONSE][
            Math.floor(n.status / 100) - 4
          ],
          n.config,
          n.request,
          n
        )
      );
}
function yu(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return (t && t[1]) || "";
}
function vu(e, t) {
  e = e || 10;
  const n = new Array(e),
    r = new Array(e);
  let s = 0,
    a = 0,
    o;
  return (
    (t = t !== void 0 ? t : 1e3),
    function (l) {
      const u = Date.now(),
        d = r[a];
      o || (o = u), (n[s] = l), (r[s] = u);
      let h = a,
        p = 0;
      for (; h !== s; ) (p += n[h++]), (h = h % e);
      if (((s = (s + 1) % e), s === a && (a = (a + 1) % e), u - o < t)) return;
      const x = d && u - d;
      return x ? Math.round((p * 1e3) / x) : void 0;
    }
  );
}
function xu(e, t) {
  let n = 0,
    r = 1e3 / t,
    s,
    a;
  const o = (u, d = Date.now()) => {
    (n = d), (s = null), a && (clearTimeout(a), (a = null)), e.apply(null, u);
  };
  return [
    (...u) => {
      const d = Date.now(),
        h = d - n;
      h >= r
        ? o(u, d)
        : ((s = u),
          a ||
            (a = setTimeout(() => {
              (a = null), o(s);
            }, r - h)));
    },
    () => s && o(s),
  ];
}
const gn = (e, t, n = 3) => {
    let r = 0;
    const s = vu(50, 250);
    return xu((a) => {
      const o = a.loaded,
        c = a.lengthComputable ? a.total : void 0,
        l = o - r,
        u = s(l),
        d = o <= c;
      r = o;
      const h = {
        loaded: o,
        total: c,
        progress: c ? o / c : void 0,
        bytes: l,
        rate: u || void 0,
        estimated: u && c && d ? (c - o) / u : void 0,
        event: a,
        lengthComputable: c != null,
        [t ? "download" : "upload"]: !0,
      };
      e(h);
    }, n);
  },
  zs = (e, t) => {
    const n = e != null;
    return [(r) => t[0]({ lengthComputable: n, total: e, loaded: r }), t[1]];
  },
  $s =
    (e) =>
    (...t) =>
      b.asap(() => e(...t)),
  bu = ue.hasStandardBrowserEnv
    ? ((e, t) => (n) => (
        (n = new URL(n, ue.origin)),
        e.protocol === n.protocol &&
          e.host === n.host &&
          (t || e.port === n.port)
      ))(
        new URL(ue.origin),
        ue.navigator && /(msie|trident)/i.test(ue.navigator.userAgent)
      )
    : () => !0,
  wu = ue.hasStandardBrowserEnv
    ? {
        write(e, t, n, r, s, a) {
          const o = [e + "=" + encodeURIComponent(t)];
          b.isNumber(n) && o.push("expires=" + new Date(n).toGMTString()),
            b.isString(r) && o.push("path=" + r),
            b.isString(s) && o.push("domain=" + s),
            a === !0 && o.push("secure"),
            (document.cookie = o.join("; "));
        },
        read(e) {
          const t = document.cookie.match(
            new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")
          );
          return t ? decodeURIComponent(t[3]) : null;
        },
        remove(e) {
          this.write(e, "", Date.now() - 864e5);
        },
      }
    : {
        write() {},
        read() {
          return null;
        },
        remove() {},
      };
function Nu(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function Eu(e, t) {
  return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function ui(e, t, n) {
  let r = !Nu(t);
  return e && (r || n == !1) ? Eu(e, t) : t;
}
const Ws = (e) => (e instanceof we ? { ...e } : e);
function st(e, t) {
  t = t || {};
  const n = {};
  function r(u, d, h, p) {
    return b.isPlainObject(u) && b.isPlainObject(d)
      ? b.merge.call({ caseless: p }, u, d)
      : b.isPlainObject(d)
      ? b.merge({}, d)
      : b.isArray(d)
      ? d.slice()
      : d;
  }
  function s(u, d, h, p) {
    if (b.isUndefined(d)) {
      if (!b.isUndefined(u)) return r(void 0, u, h, p);
    } else return r(u, d, h, p);
  }
  function a(u, d) {
    if (!b.isUndefined(d)) return r(void 0, d);
  }
  function o(u, d) {
    if (b.isUndefined(d)) {
      if (!b.isUndefined(u)) return r(void 0, u);
    } else return r(void 0, d);
  }
  function c(u, d, h) {
    if (h in t) return r(u, d);
    if (h in e) return r(void 0, u);
  }
  const l = {
    url: a,
    method: a,
    data: a,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: c,
    headers: (u, d, h) => s(Ws(u), Ws(d), h, !0),
  };
  return (
    b.forEach(Object.keys(Object.assign({}, e, t)), function (d) {
      const h = l[d] || s,
        p = h(e[d], t[d], d);
      (b.isUndefined(p) && h !== c) || (n[d] = p);
    }),
    n
  );
}
const di = (e) => {
    const t = st({}, e);
    let {
      data: n,
      withXSRFToken: r,
      xsrfHeaderName: s,
      xsrfCookieName: a,
      headers: o,
      auth: c,
    } = t;
    (t.headers = o = we.from(o)),
      (t.url = ai(
        ui(t.baseURL, t.url, t.allowAbsoluteUrls),
        e.params,
        e.paramsSerializer
      )),
      c &&
        o.set(
          "Authorization",
          "Basic " +
            btoa(
              (c.username || "") +
                ":" +
                (c.password ? unescape(encodeURIComponent(c.password)) : "")
            )
        );
    let l;
    if (b.isFormData(n)) {
      if (ue.hasStandardBrowserEnv || ue.hasStandardBrowserWebWorkerEnv)
        o.setContentType(void 0);
      else if ((l = o.getContentType()) !== !1) {
        const [u, ...d] = l
          ? l
              .split(";")
              .map((h) => h.trim())
              .filter(Boolean)
          : [];
        o.setContentType([u || "multipart/form-data", ...d].join("; "));
      }
    }
    if (
      ue.hasStandardBrowserEnv &&
      (r && b.isFunction(r) && (r = r(t)), r || (r !== !1 && bu(t.url)))
    ) {
      const u = s && a && wu.read(a);
      u && o.set(s, u);
    }
    return t;
  },
  Tu = typeof XMLHttpRequest < "u",
  Su =
    Tu &&
    function (e) {
      return new Promise(function (n, r) {
        const s = di(e);
        let a = s.data;
        const o = we.from(s.headers).normalize();
        let { responseType: c, onUploadProgress: l, onDownloadProgress: u } = s,
          d,
          h,
          p,
          x,
          v;
        function g() {
          x && x(),
            v && v(),
            s.cancelToken && s.cancelToken.unsubscribe(d),
            s.signal && s.signal.removeEventListener("abort", d);
        }
        let m = new XMLHttpRequest();
        m.open(s.method.toUpperCase(), s.url, !0), (m.timeout = s.timeout);
        function w() {
          if (!m) return;
          const N = we.from(
              "getAllResponseHeaders" in m && m.getAllResponseHeaders()
            ),
            O = {
              data:
                !c || c === "text" || c === "json"
                  ? m.responseText
                  : m.response,
              status: m.status,
              statusText: m.statusText,
              headers: N,
              config: e,
              request: m,
            };
          li(
            function (f) {
              n(f), g();
            },
            function (f) {
              r(f), g();
            },
            O
          ),
            (m = null);
        }
        "onloadend" in m
          ? (m.onloadend = w)
          : (m.onreadystatechange = function () {
              !m ||
                m.readyState !== 4 ||
                (m.status === 0 &&
                  !(m.responseURL && m.responseURL.indexOf("file:") === 0)) ||
                setTimeout(w);
            }),
          (m.onabort = function () {
            m &&
              (r(new I("Request aborted", I.ECONNABORTED, e, m)), (m = null));
          }),
          (m.onerror = function () {
            r(new I("Network Error", I.ERR_NETWORK, e, m)), (m = null);
          }),
          (m.ontimeout = function () {
            let _ = s.timeout
              ? "timeout of " + s.timeout + "ms exceeded"
              : "timeout exceeded";
            const O = s.transitional || ii;
            s.timeoutErrorMessage && (_ = s.timeoutErrorMessage),
              r(
                new I(
                  _,
                  O.clarifyTimeoutError ? I.ETIMEDOUT : I.ECONNABORTED,
                  e,
                  m
                )
              ),
              (m = null);
          }),
          a === void 0 && o.setContentType(null),
          "setRequestHeader" in m &&
            b.forEach(o.toJSON(), function (_, O) {
              m.setRequestHeader(O, _);
            }),
          b.isUndefined(s.withCredentials) ||
            (m.withCredentials = !!s.withCredentials),
          c && c !== "json" && (m.responseType = s.responseType),
          u && (([p, v] = gn(u, !0)), m.addEventListener("progress", p)),
          l &&
            m.upload &&
            (([h, x] = gn(l)),
            m.upload.addEventListener("progress", h),
            m.upload.addEventListener("loadend", x)),
          (s.cancelToken || s.signal) &&
            ((d = (N) => {
              m &&
                (r(!N || N.type ? new vt(null, e, m) : N),
                m.abort(),
                (m = null));
            }),
            s.cancelToken && s.cancelToken.subscribe(d),
            s.signal &&
              (s.signal.aborted ? d() : s.signal.addEventListener("abort", d)));
        const T = yu(s.url);
        if (T && ue.protocols.indexOf(T) === -1) {
          r(new I("Unsupported protocol " + T + ":", I.ERR_BAD_REQUEST, e));
          return;
        }
        m.send(a || null);
      });
    },
  ju = (e, t) => {
    const { length: n } = (e = e ? e.filter(Boolean) : []);
    if (t || n) {
      let r = new AbortController(),
        s;
      const a = function (u) {
        if (!s) {
          (s = !0), c();
          const d = u instanceof Error ? u : this.reason;
          r.abort(
            d instanceof I ? d : new vt(d instanceof Error ? d.message : d)
          );
        }
      };
      let o =
        t &&
        setTimeout(() => {
          (o = null), a(new I(`timeout ${t} of ms exceeded`, I.ETIMEDOUT));
        }, t);
      const c = () => {
        e &&
          (o && clearTimeout(o),
          (o = null),
          e.forEach((u) => {
            u.unsubscribe
              ? u.unsubscribe(a)
              : u.removeEventListener("abort", a);
          }),
          (e = null));
      };
      e.forEach((u) => u.addEventListener("abort", a));
      const { signal: l } = r;
      return (l.unsubscribe = () => b.asap(c)), l;
    }
  },
  _u = function* (e, t) {
    let n = e.byteLength;
    if (n < t) {
      yield e;
      return;
    }
    let r = 0,
      s;
    for (; r < n; ) (s = r + t), yield e.slice(r, s), (r = s);
  },
  Cu = async function* (e, t) {
    for await (const n of Ou(e)) yield* _u(n, t);
  },
  Ou = async function* (e) {
    if (e[Symbol.asyncIterator]) {
      yield* e;
      return;
    }
    const t = e.getReader();
    try {
      for (;;) {
        const { done: n, value: r } = await t.read();
        if (n) break;
        yield r;
      }
    } finally {
      await t.cancel();
    }
  },
  Vs = (e, t, n, r) => {
    const s = Cu(e, t);
    let a = 0,
      o,
      c = (l) => {
        o || ((o = !0), r && r(l));
      };
    return new ReadableStream(
      {
        async pull(l) {
          try {
            const { done: u, value: d } = await s.next();
            if (u) {
              c(), l.close();
              return;
            }
            let h = d.byteLength;
            if (n) {
              let p = (a += h);
              n(p);
            }
            l.enqueue(new Uint8Array(d));
          } catch (u) {
            throw (c(u), u);
          }
        },
        cancel(l) {
          return c(l), s.return();
        },
      },
      { highWaterMark: 2 }
    );
  },
  On =
    typeof fetch == "function" &&
    typeof Request == "function" &&
    typeof Response == "function",
  hi = On && typeof ReadableStream == "function",
  Au =
    On &&
    (typeof TextEncoder == "function"
      ? (
          (e) => (t) =>
            e.encode(t)
        )(new TextEncoder())
      : async (e) => new Uint8Array(await new Response(e).arrayBuffer())),
  fi = (e, ...t) => {
    try {
      return !!e(...t);
    } catch {
      return !1;
    }
  },
  ku =
    hi &&
    fi(() => {
      let e = !1;
      const t = new Request(ue.origin, {
        body: new ReadableStream(),
        method: "POST",
        get duplex() {
          return (e = !0), "half";
        },
      }).headers.has("Content-Type");
      return e && !t;
    }),
  qs = 64 * 1024,
  xr = hi && fi(() => b.isReadableStream(new Response("").body)),
  yn = { stream: xr && ((e) => e.body) };
On &&
  ((e) => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t) => {
      !yn[t] &&
        (yn[t] = b.isFunction(e[t])
          ? (n) => n[t]()
          : (n, r) => {
              throw new I(
                `Response type '${t}' is not supported`,
                I.ERR_NOT_SUPPORT,
                r
              );
            });
    });
  })(new Response());
const Ru = async (e) => {
    if (e == null) return 0;
    if (b.isBlob(e)) return e.size;
    if (b.isSpecCompliantForm(e))
      return (
        await new Request(ue.origin, { method: "POST", body: e }).arrayBuffer()
      ).byteLength;
    if (b.isArrayBufferView(e) || b.isArrayBuffer(e)) return e.byteLength;
    if ((b.isURLSearchParams(e) && (e = e + ""), b.isString(e)))
      return (await Au(e)).byteLength;
  },
  Pu = async (e, t) => {
    const n = b.toFiniteNumber(e.getContentLength());
    return n ?? Ru(t);
  },
  Du =
    On &&
    (async (e) => {
      let {
        url: t,
        method: n,
        data: r,
        signal: s,
        cancelToken: a,
        timeout: o,
        onDownloadProgress: c,
        onUploadProgress: l,
        responseType: u,
        headers: d,
        withCredentials: h = "same-origin",
        fetchOptions: p,
      } = di(e);
      u = u ? (u + "").toLowerCase() : "text";
      let x = ju([s, a && a.toAbortSignal()], o),
        v;
      const g =
        x &&
        x.unsubscribe &&
        (() => {
          x.unsubscribe();
        });
      let m;
      try {
        if (
          l &&
          ku &&
          n !== "get" &&
          n !== "head" &&
          (m = await Pu(d, r)) !== 0
        ) {
          let O = new Request(t, { method: "POST", body: r, duplex: "half" }),
            j;
          if (
            (b.isFormData(r) &&
              (j = O.headers.get("content-type")) &&
              d.setContentType(j),
            O.body)
          ) {
            const [f, E] = zs(m, gn($s(l)));
            r = Vs(O.body, qs, f, E);
          }
        }
        b.isString(h) || (h = h ? "include" : "omit");
        const w = "credentials" in Request.prototype;
        v = new Request(t, {
          ...p,
          signal: x,
          method: n.toUpperCase(),
          headers: d.normalize().toJSON(),
          body: r,
          duplex: "half",
          credentials: w ? h : void 0,
        });
        let T = await fetch(v, p);
        const N = xr && (u === "stream" || u === "response");
        if (xr && (c || (N && g))) {
          const O = {};
          ["status", "statusText", "headers"].forEach((S) => {
            O[S] = T[S];
          });
          const j = b.toFiniteNumber(T.headers.get("content-length")),
            [f, E] = (c && zs(j, gn($s(c), !0))) || [];
          T = new Response(
            Vs(T.body, qs, f, () => {
              E && E(), g && g();
            }),
            O
          );
        }
        u = u || "text";
        let _ = await yn[b.findKey(yn, u) || "text"](T, e);
        return (
          !N && g && g(),
          await new Promise((O, j) => {
            li(O, j, {
              data: _,
              headers: we.from(T.headers),
              status: T.status,
              statusText: T.statusText,
              config: e,
              request: v,
            });
          })
        );
      } catch (w) {
        throw (
          (g && g(),
          w && w.name === "TypeError" && /Load failed|fetch/i.test(w.message)
            ? Object.assign(new I("Network Error", I.ERR_NETWORK, e, v), {
                cause: w.cause || w,
              })
            : I.from(w, w && w.code, e, v))
        );
      }
    }),
  br = { http: Jl, xhr: Su, fetch: Du };
b.forEach(br, (e, t) => {
  if (e) {
    try {
      Object.defineProperty(e, "name", { value: t });
    } catch {}
    Object.defineProperty(e, "adapterName", { value: t });
  }
});
const Ys = (e) => `- ${e}`,
  Lu = (e) => b.isFunction(e) || e === null || e === !1,
  mi = {
    getAdapter: (e) => {
      e = b.isArray(e) ? e : [e];
      const { length: t } = e;
      let n, r;
      const s = {};
      for (let a = 0; a < t; a++) {
        n = e[a];
        let o;
        if (
          ((r = n),
          !Lu(n) && ((r = br[(o = String(n)).toLowerCase()]), r === void 0))
        )
          throw new I(`Unknown adapter '${o}'`);
        if (r) break;
        s[o || "#" + a] = r;
      }
      if (!r) {
        const a = Object.entries(s).map(
          ([c, l]) =>
            `adapter ${c} ` +
            (l === !1
              ? "is not supported by the environment"
              : "is not available in the build")
        );
        let o = t
          ? a.length > 1
            ? `since :
` +
              a.map(Ys).join(`
`)
            : " " + Ys(a[0])
          : "as no adapter specified";
        throw new I(
          "There is no suitable adapter to dispatch the request " + o,
          "ERR_NOT_SUPPORT"
        );
      }
      return r;
    },
    adapters: br,
  };
function Zn(e) {
  if (
    (e.cancelToken && e.cancelToken.throwIfRequested(),
    e.signal && e.signal.aborted)
  )
    throw new vt(null, e);
}
function Xs(e) {
  return (
    Zn(e),
    (e.headers = we.from(e.headers)),
    (e.data = Qn.call(e, e.transformRequest)),
    ["post", "put", "patch"].indexOf(e.method) !== -1 &&
      e.headers.setContentType("application/x-www-form-urlencoded", !1),
    mi
      .getAdapter(e.adapter || Ut.adapter)(e)
      .then(
        function (r) {
          return (
            Zn(e),
            (r.data = Qn.call(e, e.transformResponse, r)),
            (r.headers = we.from(r.headers)),
            r
          );
        },
        function (r) {
          return (
            ci(r) ||
              (Zn(e),
              r &&
                r.response &&
                ((r.response.data = Qn.call(
                  e,
                  e.transformResponse,
                  r.response
                )),
                (r.response.headers = we.from(r.response.headers)))),
            Promise.reject(r)
          );
        }
      )
  );
}
const pi = "1.10.0",
  An = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach(
  (e, t) => {
    An[e] = function (r) {
      return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
    };
  }
);
const Js = {};
An.transitional = function (t, n, r) {
  function s(a, o) {
    return (
      "[Axios v" +
      pi +
      "] Transitional option '" +
      a +
      "'" +
      o +
      (r ? ". " + r : "")
    );
  }
  return (a, o, c) => {
    if (t === !1)
      throw new I(
        s(o, " has been removed" + (n ? " in " + n : "")),
        I.ERR_DEPRECATED
      );
    return (
      n &&
        !Js[o] &&
        ((Js[o] = !0),
        console.warn(
          s(
            o,
            " has been deprecated since v" +
              n +
              " and will be removed in the near future"
          )
        )),
      t ? t(a, o, c) : !0
    );
  };
};
An.spelling = function (t) {
  return (n, r) => (console.warn(`${r} is likely a misspelling of ${t}`), !0);
};
function Iu(e, t, n) {
  if (typeof e != "object")
    throw new I("options must be an object", I.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(e);
  let s = r.length;
  for (; s-- > 0; ) {
    const a = r[s],
      o = t[a];
    if (o) {
      const c = e[a],
        l = c === void 0 || o(c, a, e);
      if (l !== !0)
        throw new I("option " + a + " must be " + l, I.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (n !== !0) throw new I("Unknown option " + a, I.ERR_BAD_OPTION);
  }
}
const an = { assertOptions: Iu, validators: An },
  Ue = an.validators;
let tt = class {
  constructor(t) {
    (this.defaults = t || {}),
      (this.interceptors = { request: new Hs(), response: new Hs() });
  }
  async request(t, n) {
    try {
      return await this._request(t, n);
    } catch (r) {
      if (r instanceof Error) {
        let s = {};
        Error.captureStackTrace
          ? Error.captureStackTrace(s)
          : (s = new Error());
        const a = s.stack ? s.stack.replace(/^.+\n/, "") : "";
        try {
          r.stack
            ? a &&
              !String(r.stack).endsWith(a.replace(/^.+\n.+\n/, "")) &&
              (r.stack +=
                `
` + a)
            : (r.stack = a);
        } catch {}
      }
      throw r;
    }
  }
  _request(t, n) {
    typeof t == "string" ? ((n = n || {}), (n.url = t)) : (n = t || {}),
      (n = st(this.defaults, n));
    const { transitional: r, paramsSerializer: s, headers: a } = n;
    r !== void 0 &&
      an.assertOptions(
        r,
        {
          silentJSONParsing: Ue.transitional(Ue.boolean),
          forcedJSONParsing: Ue.transitional(Ue.boolean),
          clarifyTimeoutError: Ue.transitional(Ue.boolean),
        },
        !1
      ),
      s != null &&
        (b.isFunction(s)
          ? (n.paramsSerializer = { serialize: s })
          : an.assertOptions(
              s,
              { encode: Ue.function, serialize: Ue.function },
              !0
            )),
      n.allowAbsoluteUrls !== void 0 ||
        (this.defaults.allowAbsoluteUrls !== void 0
          ? (n.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
          : (n.allowAbsoluteUrls = !0)),
      an.assertOptions(
        n,
        {
          baseUrl: Ue.spelling("baseURL"),
          withXsrfToken: Ue.spelling("withXSRFToken"),
        },
        !0
      ),
      (n.method = (n.method || this.defaults.method || "get").toLowerCase());
    let o = a && b.merge(a.common, a[n.method]);
    a &&
      b.forEach(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (v) => {
          delete a[v];
        }
      ),
      (n.headers = we.concat(o, a));
    const c = [];
    let l = !0;
    this.interceptors.request.forEach(function (g) {
      (typeof g.runWhen == "function" && g.runWhen(n) === !1) ||
        ((l = l && g.synchronous), c.unshift(g.fulfilled, g.rejected));
    });
    const u = [];
    this.interceptors.response.forEach(function (g) {
      u.push(g.fulfilled, g.rejected);
    });
    let d,
      h = 0,
      p;
    if (!l) {
      const v = [Xs.bind(this), void 0];
      for (
        v.unshift.apply(v, c),
          v.push.apply(v, u),
          p = v.length,
          d = Promise.resolve(n);
        h < p;

      )
        d = d.then(v[h++], v[h++]);
      return d;
    }
    p = c.length;
    let x = n;
    for (h = 0; h < p; ) {
      const v = c[h++],
        g = c[h++];
      try {
        x = v(x);
      } catch (m) {
        g.call(this, m);
        break;
      }
    }
    try {
      d = Xs.call(this, x);
    } catch (v) {
      return Promise.reject(v);
    }
    for (h = 0, p = u.length; h < p; ) d = d.then(u[h++], u[h++]);
    return d;
  }
  getUri(t) {
    t = st(this.defaults, t);
    const n = ui(t.baseURL, t.url, t.allowAbsoluteUrls);
    return ai(n, t.params, t.paramsSerializer);
  }
};
b.forEach(["delete", "get", "head", "options"], function (t) {
  tt.prototype[t] = function (n, r) {
    return this.request(
      st(r || {}, { method: t, url: n, data: (r || {}).data })
    );
  };
});
b.forEach(["post", "put", "patch"], function (t) {
  function n(r) {
    return function (a, o, c) {
      return this.request(
        st(c || {}, {
          method: t,
          headers: r ? { "Content-Type": "multipart/form-data" } : {},
          url: a,
          data: o,
        })
      );
    };
  }
  (tt.prototype[t] = n()), (tt.prototype[t + "Form"] = n(!0));
});
let Mu = class gi {
  constructor(t) {
    if (typeof t != "function")
      throw new TypeError("executor must be a function.");
    let n;
    this.promise = new Promise(function (a) {
      n = a;
    });
    const r = this;
    this.promise.then((s) => {
      if (!r._listeners) return;
      let a = r._listeners.length;
      for (; a-- > 0; ) r._listeners[a](s);
      r._listeners = null;
    }),
      (this.promise.then = (s) => {
        let a;
        const o = new Promise((c) => {
          r.subscribe(c), (a = c);
        }).then(s);
        return (
          (o.cancel = function () {
            r.unsubscribe(a);
          }),
          o
        );
      }),
      t(function (a, o, c) {
        r.reason || ((r.reason = new vt(a, o, c)), n(r.reason));
      });
  }
  throwIfRequested() {
    if (this.reason) throw this.reason;
  }
  subscribe(t) {
    if (this.reason) {
      t(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(t) : (this._listeners = [t]);
  }
  unsubscribe(t) {
    if (!this._listeners) return;
    const n = this._listeners.indexOf(t);
    n !== -1 && this._listeners.splice(n, 1);
  }
  toAbortSignal() {
    const t = new AbortController(),
      n = (r) => {
        t.abort(r);
      };
    return (
      this.subscribe(n),
      (t.signal.unsubscribe = () => this.unsubscribe(n)),
      t.signal
    );
  }
  static source() {
    let t;
    return {
      token: new gi(function (s) {
        t = s;
      }),
      cancel: t,
    };
  }
};
function Bu(e) {
  return function (n) {
    return e.apply(null, n);
  };
}
function Fu(e) {
  return b.isObject(e) && e.isAxiosError === !0;
}
const wr = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};
Object.entries(wr).forEach(([e, t]) => {
  wr[t] = e;
});
function yi(e) {
  const t = new tt(e),
    n = Ya(tt.prototype.request, t);
  return (
    b.extend(n, tt.prototype, t, { allOwnKeys: !0 }),
    b.extend(n, t, null, { allOwnKeys: !0 }),
    (n.create = function (s) {
      return yi(st(e, s));
    }),
    n
  );
}
const J = yi(Ut);
J.Axios = tt;
J.CanceledError = vt;
J.CancelToken = Mu;
J.isCancel = ci;
Jversion = pi;
J.toFormData = Cn;
J.AxiosError = I;
J.Cancel = J.CanceledError;
J.all = function (t) {
  return Promise.all(t);
};
J.spread = Bu;
J.isAxiosError = Fu;
J.mergeConfig = st;
J.AxiosHeaders = we;
J.formToJSON = (e) => oi(b.isHTMLForm(e) ? new FormData(e) : e);
J.getAdapter = mi.getAdapter;
J.HttpStatusCode = wr;
J.default = J;
const {
    Axios: rp,
    AxiosError: sp,
    CanceledError: ap,
    isCancel: ip,
    CancelToken: op,
    VERSION: cp,
    all: lp,
    Cancel: up,
    isAxiosError: dp,
    spread: hp,
    toFormData: fp,
    AxiosHeaders: mp,
    HttpStatusCode: pp,
    formToJSON: gp,
    getAdapter: yp,
    mergeConfig: vp,
  } = J,
  vi = location.origin.includes("5173")
    ? "http://10.208.218.131:3000"
    : location.origin,
  le = J.create({ baseURL: vi });
J.create({ baseURL: "https://sprintet.onrender.com" });
const $e = Object.create(null);
$e.open = "0";
$e.close = "1";
$e.ping = "2";
$e.pong = "3";
$e.message = "4";
$e.upgrade = "5";
$e.noop = "6";
const on = Object.create(null);
Object.keys($e).forEach((e) => {
  on[$e[e]] = e;
});
const Nr = { type: "error", data: "parser error" },
  xi =
    typeof Blob == "function" ||
    (typeof Blob < "u" &&
      Object.prototype.toString.call(Blob) === "[object BlobConstructor]"),
  bi = typeof ArrayBuffer == "function",
  wi = (e) =>
    typeof ArrayBuffer.isView == "function"
      ? ArrayBuffer.isView(e)
      : e && e.buffer instanceof ArrayBuffer,
  Zr = ({ type: e, data: t }, n, r) =>
    xi && t instanceof Blob
      ? n
        ? r(t)
        : Gs(t, r)
      : bi && (t instanceof ArrayBuffer || wi(t))
      ? n
        ? r(t)
        : Gs(new Blob([t]), r)
      : r($e[e] + (t || "")),
  Gs = (e, t) => {
    const n = new FileReader();
    return (
      (n.onload = function () {
        const r = n.result.split(",")[1];
        t("b" + (r || ""));
      }),
      n.readAsDataURL(e)
    );
  };
function Ks(e) {
  return e instanceof Uint8Array
    ? e
    : e instanceof ArrayBuffer
    ? new Uint8Array(e)
    : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
}
let er;
function Hu(e, t) {
  if (xi && e.data instanceof Blob)
    return e.data.arrayBuffer().then(Ks).then(t);
  if (bi && (e.data instanceof ArrayBuffer || wi(e.data))) return t(Ks(e.data));
  Zr(e, !1, (n) => {
    er || (er = new TextEncoder()), t(er.encode(n));
  });
}
const Qs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  _t = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let e = 0; e < Qs.length; e++) _t[Qs.charCodeAt(e)] = e;
const Uu = (e) => {
    let t = e.length * 0.75,
      n = e.length,
      r,
      s = 0,
      a,
      o,
      c,
      l;
    e[e.length - 1] === "=" && (t--, e[e.length - 2] === "=" && t--);
    const u = new ArrayBuffer(t),
      d = new Uint8Array(u);
    for (r = 0; r < n; r += 4)
      (a = _t[e.charCodeAt(r)]),
        (o = _t[e.charCodeAt(r + 1)]),
        (c = _t[e.charCodeAt(r + 2)]),
        (l = _t[e.charCodeAt(r + 3)]),
        (d[s++] = (a << 2) | (o >> 4)),
        (d[s++] = ((o & 15) << 4) | (c >> 2)),
        (d[s++] = ((c & 3) << 6) | (l & 63));
    return u;
  },
  zu = typeof ArrayBuffer == "function",
  es = (e, t) => {
    if (typeof e != "string") return { type: "message", data: Ni(e, t) };
    const n = e.charAt(0);
    return n === "b"
      ? { type: "message", data: $u(e.substring(1), t) }
      : on[n]
      ? e.length > 1
        ? { type: on[n], data: e.substring(1) }
        : { type: on[n] }
      : Nr;
  },
  $u = (e, t) => {
    if (zu) {
      const n = Uu(e);
      return Ni(n, t);
    } else return { base64: !0, data: e };
  },
  Ni = (e, t) => {
    switch (t) {
      case "blob":
        return e instanceof Blob ? e : new Blob([e]);
      case "arraybuffer":
      default:
        return e instanceof ArrayBuffer ? e : e.buffer;
    }
  },
  Ei = "",
  Wu = (e, t) => {
    const n = e.length,
      r = new Array(n);
    let s = 0;
    e.forEach((a, o) => {
      Zr(a, !1, (c) => {
        (r[o] = c), ++s === n && t(r.join(Ei));
      });
    });
  },
  Vu = (e, t) => {
    const n = e.split(Ei),
      r = [];
    for (let s = 0; s < n.length; s++) {
      const a = es(n[s], t);
      if ((r.push(a), a.type === "error")) break;
    }
    return r;
  };
function qu() {
  return new TransformStream({
    transform(e, t) {
      Hu(e, (n) => {
        const r = n.length;
        let s;
        if (r < 126)
          (s = new Uint8Array(1)), new DataView(s.buffer).setUint8(0, r);
        else if (r < 65536) {
          s = new Uint8Array(3);
          const a = new DataView(s.buffer);
          a.setUint8(0, 126), a.setUint16(1, r);
        } else {
          s = new Uint8Array(9);
          const a = new DataView(s.buffer);
          a.setUint8(0, 127), a.setBigUint64(1, BigInt(r));
        }
        e.data && typeof e.data != "string" && (s[0] |= 128),
          t.enqueue(s),
          t.enqueue(n);
      });
    },
  });
}
let tr;
function Qt(e) {
  return e.reduce((t, n) => t + n.length, 0);
}
function Zt(e, t) {
  if (e[0].length === t) return e.shift();
  const n = new Uint8Array(t);
  let r = 0;
  for (let s = 0; s < t; s++)
    (n[s] = e[0][r++]), r === e[0].length && (e.shift(), (r = 0));
  return e.length && r < e[0].length && (e[0] = e[0].slice(r)), n;
}
function Yu(e, t) {
  tr || (tr = new TextDecoder());
  const n = [];
  let r = 0,
    s = -1,
    a = !1;
  return new TransformStream({
    transform(o, c) {
      for (n.push(o); ; ) {
        if (r === 0) {
          if (Qt(n) < 1) break;
          const l = Zt(n, 1);
          (a = (l[0] & 128) === 128),
            (s = l[0] & 127),
            s < 126 ? (r = 3) : s === 126 ? (r = 1) : (r = 2);
        } else if (r === 1) {
          if (Qt(n) < 2) break;
          const l = Zt(n, 2);
          (s = new DataView(l.buffer, l.byteOffset, l.length).getUint16(0)),
            (r = 3);
        } else if (r === 2) {
          if (Qt(n) < 8) break;
          const l = Zt(n, 8),
            u = new DataView(l.buffer, l.byteOffset, l.length),
            d = u.getUint32(0);
          if (d > Math.pow(2, 21) - 1) {
            c.enqueue(Nr);
            break;
          }
          (s = d * Math.pow(2, 32) + u.getUint32(4)), (r = 3);
        } else {
          if (Qt(n) < s) break;
          const l = Zt(n, s);
          c.enqueue(es(a ? l : tr.decode(l), t)), (r = 0);
        }
        if (s === 0 || s > e) {
          c.enqueue(Nr);
          break;
        }
      }
    },
  });
}
const Ti = 4;
function Z(e) {
  if (e) return Xu(e);
}
function Xu(e) {
  for (var t in Z.prototype) e[t] = Z.prototype[t];
  return e;
}
Z.prototype.on = Z.prototype.addEventListener = function (e, t) {
  return (
    (this._callbacks = this._callbacks || {}),
    (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t),
    this
  );
};
Z.prototype.once = function (e, t) {
  function n() {
    this.off(e, n), t.apply(this, arguments);
  }
  return (n.fn = t), this.on(e, n), this;
};
Z.prototype.off =
  Z.prototype.removeListener =
  Z.prototype.removeAllListeners =
  Z.prototype.removeEventListener =
    function (e, t) {
      if (((this._callbacks = this._callbacks || {}), arguments.length == 0))
        return (this._callbacks = {}), this;
      var n = this._callbacks["$" + e];
      if (!n) return this;
      if (arguments.length == 1) return delete this._callbacks["$" + e], this;
      for (var r, s = 0; s < n.length; s++)
        if (((r = n[s]), r === t || r.fn === t)) {
          n.splice(s, 1);
          break;
        }
      return n.length === 0 && delete this._callbacks["$" + e], this;
    };
Z.prototype.emit = function (e) {
  this._callbacks = this._callbacks || {};
  for (
    var t = new Array(arguments.length - 1),
      n = this._callbacks["$" + e],
      r = 1;
    r < arguments.length;
    r++
  )
    t[r - 1] = arguments[r];
  if (n) {
    n = n.slice(0);
    for (var r = 0, s = n.length; r < s; ++r) n[r].apply(this, t);
  }
  return this;
};
Z.prototype.emitReserved = Z.prototype.emit;
Z.prototype.listeners = function (e) {
  return (
    (this._callbacks = this._callbacks || {}), this._callbacks["$" + e] || []
  );
};
Z.prototype.hasListeners = function (e) {
  return !!this.listeners(e).length;
};
const kn =
    typeof Promise == "function" && typeof Promise.resolve == "function"
      ? (t) => Promise.resolve().then(t)
      : (t, n) => n(t, 0),
  Ae =
    typeof self < "u"
      ? self
      : typeof window < "u"
      ? window
      : Function("return this")(),
  Ju = "arraybuffer";
function Si(e, ...t) {
  return t.reduce((n, r) => (e.hasOwnProperty(r) && (n[r] = e[r]), n), {});
}
const Gu = Ae.setTimeout,
  Ku = Ae.clearTimeout;
function Rn(e, t) {
  t.useNativeTimers
    ? ((e.setTimeoutFn = Gu.bind(Ae)), (e.clearTimeoutFn = Ku.bind(Ae)))
    : ((e.setTimeoutFn = Ae.setTimeout.bind(Ae)),
      (e.clearTimeoutFn = Ae.clearTimeout.bind(Ae)));
}
const Qu = 1.33;
function Zu(e) {
  return typeof e == "string"
    ? ed(e)
    : Math.ceil((e.byteLength || e.size) * Qu);
}
function ed(e) {
  let t = 0,
    n = 0;
  for (let r = 0, s = e.length; r < s; r++)
    (t = e.charCodeAt(r)),
      t < 128
        ? (n += 1)
        : t < 2048
        ? (n += 2)
        : t < 55296 || t >= 57344
        ? (n += 3)
        : (r++, (n += 4));
  return n;
}
function ji() {
  return (
    Date.now().toString(36).substring(3) +
    Math.random().toString(36).substring(2, 5)
  );
}
function td(e) {
  let t = "";
  for (let n in e)
    e.hasOwnProperty(n) &&
      (t.length && (t += "&"),
      (t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n])));
  return t;
}
function nd(e) {
  let t = {},
    n = e.split("&");
  for (let r = 0, s = n.length; r < s; r++) {
    let a = n[r].split("=");
    t[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
  }
  return t;
}
class rd extends Error {
  constructor(t, n, r) {
    super(t),
      (this.description = n),
      (this.context = r),
      (this.type = "TransportError");
  }
}
class ts extends Z {
  constructor(t) {
    super(),
      (this.writable = !1),
      Rn(this, t),
      (this.opts = t),
      (this.query = t.query),
      (this.socket = t.socket),
      (this.supportsBinary = !t.forceBase64);
  }
  onError(t, n, r) {
    return super.emitReserved("error", new rd(t, n, r)), this;
  }
  open() {
    return (this.readyState = "opening"), this.doOpen(), this;
  }
  close() {
    return (
      (this.readyState === "opening" || this.readyState === "open") &&
        (this.doClose(), this.onClose()),
      this
    );
  }
  send(t) {
    this.readyState === "open" && this.write(t);
  }
  onOpen() {
    (this.readyState = "open"),
      (this.writable = !0),
      super.emitReserved("open");
  }
  onData(t) {
    const n = es(t, this.socket.binaryType);
    this.onPacket(n);
  }
  onPacket(t) {
    super.emitReserved("packet", t);
  }
  onClose(t) {
    (this.readyState = "closed"), super.emitReserved("close", t);
  }
  pause(t) {}
  createUri(t, n = {}) {
    return (
      t +
      "://" +
      this._hostname() +
      this._port() +
      this.opts.path +
      this._query(n)
    );
  }
  _hostname() {
    const t = this.opts.hostname;
    return t.indexOf(":") === -1 ? t : "[" + t + "]";
  }
  _port() {
    return this.opts.port &&
      ((this.opts.secure && +(this.opts.port !== 443)) ||
        (!this.opts.secure && Number(this.opts.port) !== 80))
      ? ":" + this.opts.port
      : "";
  }
  _query(t) {
    const n = td(t);
    return n.length ? "?" + n : "";
  }
}
class sd extends ts {
  constructor() {
    super(...arguments), (this._polling = !1);
  }
  get name() {
    return "polling";
  }
  doOpen() {
    this._poll();
  }
  pause(t) {
    this.readyState = "pausing";
    const n = () => {
      (this.readyState = "paused"), t();
    };
    if (this._polling || !this.writable) {
      let r = 0;
      this._polling &&
        (r++,
        this.once("pollComplete", function () {
          --r || n();
        })),
        this.writable ||
          (r++,
          this.once("drain", function () {
            --r || n();
          }));
    } else n();
  }
  _poll() {
    (this._polling = !0), this.doPoll(), this.emitReserved("poll");
  }
  onData(t) {
    const n = (r) => {
      if (
        (this.readyState === "opening" && r.type === "open" && this.onOpen(),
        r.type === "close")
      )
        return (
          this.onClose({ description: "transport closed by the server" }), !1
        );
      this.onPacket(r);
    };
    Vu(t, this.socket.binaryType).forEach(n),
      this.readyState !== "closed" &&
        ((this._polling = !1),
        this.emitReserved("pollComplete"),
        this.readyState === "open" && this._poll());
  }
  doClose() {
    const t = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? t() : this.once("open", t);
  }
  write(t) {
    (this.writable = !1),
      Wu(t, (n) => {
        this.doWrite(n, () => {
          (this.writable = !0), this.emitReserved("drain");
        });
      });
  }
  uri() {
    const t = this.opts.secure ? "https" : "http",
      n = this.query || {};
    return (
      this.opts.timestampRequests !== !1 &&
        (n[this.opts.timestampParam] = ji()),
      !this.supportsBinary && !n.sid && (n.b64 = 1),
      this.createUri(t, n)
    );
  }
}
let _i = !1;
try {
  _i = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {}
const ad = _i;
function id() {}
class od extends sd {
  constructor(t) {
    if ((super(t), typeof location < "u")) {
      const n = location.protocol === "https:";
      let r = location.port;
      r || (r = n ? "443" : "80"),
        (this.xd =
          (typeof location < "u" && t.hostname !== location.hostname) ||
          r !== t.port);
    }
  }
  doWrite(t, n) {
    const r = this.request({ method: "POST", data: t });
    r.on("success", n),
      r.on("error", (s, a) => {
        this.onError("xhr post error", s, a);
      });
  }
  doPoll() {
    const t = this.request();
    t.on("data", this.onData.bind(this)),
      t.on("error", (n, r) => {
        this.onError("xhr poll error", n, r);
      }),
      (this.pollXhr = t);
  }
}
let mt = class cn extends Z {
  constructor(t, n, r) {
    super(),
      (this.createRequest = t),
      Rn(this, r),
      (this._opts = r),
      (this._method = r.method || "GET"),
      (this._uri = n),
      (this._data = r.data !== void 0 ? r.data : null),
      this._create();
  }
  _create() {
    var t;
    const n = Si(
      this._opts,
      "agent",
      "pfx",
      "key",
      "passphrase",
      "cert",
      "ca",
      "ciphers",
      "rejectUnauthorized",
      "autoUnref"
    );
    n.xdomain = !!this._opts.xd;
    const r = (this._xhr = this.createRequest(n));
    try {
      r.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          r.setDisableHeaderCheck && r.setDisableHeaderCheck(!0);
          for (let s in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(s) &&
              r.setRequestHeader(s, this._opts.extraHeaders[s]);
        }
      } catch {}
      if (this._method === "POST")
        try {
          r.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {}
      try {
        r.setRequestHeader("Accept", "*/*");
      } catch {}
      (t = this._opts.cookieJar) === null || t === void 0 || t.addCookies(r),
        "withCredentials" in r &&
          (r.withCredentials = this._opts.withCredentials),
        this._opts.requestTimeout && (r.timeout = this._opts.requestTimeout),
        (r.onreadystatechange = () => {
          var s;
          r.readyState === 3 &&
            ((s = this._opts.cookieJar) === null ||
              s === void 0 ||
              s.parseCookies(r.getResponseHeader("set-cookie"))),
            r.readyState === 4 &&
              (r.status === 200 || r.status === 1223
                ? this._onLoad()
                : this.setTimeoutFn(() => {
                    this._onError(typeof r.status == "number" ? r.status : 0);
                  }, 0));
        }),
        r.send(this._data);
    } catch (s) {
      this.setTimeoutFn(() => {
        this._onError(s);
      }, 0);
      return;
    }
    typeof document < "u" &&
      ((this._index = cn.requestsCount++), (cn.requests[this._index] = this));
  }
  _onError(t) {
    this.emitReserved("error", t, this._xhr), this._cleanup(!0);
  }
  _cleanup(t) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (((this._xhr.onreadystatechange = id), t))
        try {
          this._xhr.abort();
        } catch {}
      typeof document < "u" && delete cn.requests[this._index],
        (this._xhr = null);
    }
  }
  _onLoad() {
    const t = this._xhr.responseText;
    t !== null &&
      (this.emitReserved("data", t),
      this.emitReserved("success"),
      this._cleanup());
  }
  abort() {
    this._cleanup();
  }
};
mt.requestsCount = 0;
mt.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function") attachEvent("onunload", Zs);
  else if (typeof addEventListener == "function") {
    const e = "onpagehide" in Ae ? "pagehide" : "unload";
    addEventListener(e, Zs, !1);
  }
}
function Zs() {
  for (let e in mt.requests)
    mt.requests.hasOwnProperty(e) && mt.requests[e].abort();
}
const cd = (function () {
  const e = Ci({ xdomain: !1 });
  return e && e.responseType !== null;
})();
class ld extends od {
  constructor(t) {
    super(t);
    const n = t && t.forceBase64;
    this.supportsBinary = cd && !n;
  }
  request(t = {}) {
    return (
      Object.assign(t, { xd: this.xd }, this.opts), new mt(Ci, this.uri(), t)
    );
  }
}
function Ci(e) {
  const t = e.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!t || ad)) return new XMLHttpRequest();
  } catch {}
  if (!t)
    try {
      return new Ae[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {}
}
const Oi =
  typeof navigator < "u" &&
  typeof navigator.product == "string" &&
  navigator.product.toLowerCase() === "reactnative";
class ud extends ts {
  get name() {
    return "websocket";
  }
  doOpen() {
    const t = this.uri(),
      n = this.opts.protocols,
      r = Oi
        ? {}
        : Si(
            this.opts,
            "agent",
            "perMessageDeflate",
            "pfx",
            "key",
            "passphrase",
            "cert",
            "ca",
            "ciphers",
            "rejectUnauthorized",
            "localAddress",
            "protocolVersion",
            "origin",
            "maxPayload",
            "family",
            "checkServerIdentity"
          );
    this.opts.extraHeaders && (r.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(t, n, r);
    } catch (s) {
      return this.emitReserved("error", s);
    }
    (this.ws.binaryType = this.socket.binaryType), this.addEventListeners();
  }
  addEventListeners() {
    (this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }),
      (this.ws.onclose = (t) =>
        this.onClose({
          description: "websocket connection closed",
          context: t,
        })),
      (this.ws.onmessage = (t) => this.onData(t.data)),
      (this.ws.onerror = (t) => this.onError("websocket error", t));
  }
  write(t) {
    this.writable = !1;
    for (let n = 0; n < t.length; n++) {
      const r = t[n],
        s = n === t.length - 1;
      Zr(r, this.supportsBinary, (a) => {
        try {
          this.doWrite(r, a);
        } catch {}
        s &&
          kn(() => {
            (this.writable = !0), this.emitReserved("drain");
          }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" &&
      ((this.ws.onerror = () => {}), this.ws.close(), (this.ws = null));
  }
  uri() {
    const t = this.opts.secure ? "wss" : "ws",
      n = this.query || {};
    return (
      this.opts.timestampRequests && (n[this.opts.timestampParam] = ji()),
      this.supportsBinary || (n.b64 = 1),
      this.createUri(t, n)
    );
  }
}
const nr = Ae.WebSocket || Ae.MozWebSocket;
class dd extends ud {
  createSocket(t, n, r) {
    return Oi ? new nr(t, n, r) : n ? new nr(t, n) : new nr(t);
  }
  doWrite(t, n) {
    this.ws.send(n);
  }
}
class hd extends ts {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(
        this.createUri("https"),
        this.opts.transportOptions[this.name]
      );
    } catch (t) {
      return this.emitReserved("error", t);
    }
    this._transport.closed
      .then(() => {
        this.onClose();
      })
      .catch((t) => {
        this.onError("webtransport error", t);
      }),
      this._transport.ready.then(() => {
        this._transport.createBidirectionalStream().then((t) => {
          const n = Yu(Number.MAX_SAFE_INTEGER, this.socket.binaryType),
            r = t.readable.pipeThrough(n).getReader(),
            s = qu();
          s.readable.pipeTo(t.writable),
            (this._writer = s.writable.getWriter());
          const a = () => {
            r.read()
              .then(({ done: c, value: l }) => {
                c || (this.onPacket(l), a());
              })
              .catch((c) => {});
          };
          a();
          const o = { type: "open" };
          this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`),
            this._writer.write(o).then(() => this.onOpen());
        });
      });
  }
  write(t) {
    this.writable = !1;
    for (let n = 0; n < t.length; n++) {
      const r = t[n],
        s = n === t.length - 1;
      this._writer.write(r).then(() => {
        s &&
          kn(() => {
            (this.writable = !0), this.emitReserved("drain");
          }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var t;
    (t = this._transport) === null || t === void 0 || t.close();
  }
}
const fd = { websocket: dd, webtransport: hd, polling: ld },
  md =
    /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
  pd = [
    "source",
    "protocol",
    "authority",
    "userInfo",
    "user",
    "password",
    "host",
    "port",
    "relative",
    "path",
    "directory",
    "file",
    "query",
    "anchor",
  ];
function Er(e) {
  if (e.length > 8e3) throw "URI too long";
  const t = e,
    n = e.indexOf("["),
    r = e.indexOf("]");
  n != -1 &&
    r != -1 &&
    (e =
      e.substring(0, n) +
      e.substring(n, r).replace(/:/g, ";") +
      e.substring(r, e.length));
  let s = md.exec(e || ""),
    a = {},
    o = 14;
  for (; o--; ) a[pd[o]] = s[o] || "";
  return (
    n != -1 &&
      r != -1 &&
      ((a.source = t),
      (a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":")),
      (a.authority = a.authority
        .replace("[", "")
        .replace("]", "")
        .replace(/;/g, ":")),
      (a.ipv6uri = !0)),
    (a.pathNames = gd(a, a.path)),
    (a.queryKey = yd(a, a.query)),
    a
  );
}
function gd(e, t) {
  const n = /\/{2,9}/g,
    r = t.replace(n, "/").split("/");
  return (
    (t.slice(0, 1) == "/" || t.length === 0) && r.splice(0, 1),
    t.slice(-1) == "/" && r.splice(r.length - 1, 1),
    r
  );
}
function yd(e, t) {
  const n = {};
  return (
    t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (r, s, a) {
      s && (n[s] = a);
    }),
    n
  );
}
const Tr =
    typeof addEventListener == "function" &&
    typeof removeEventListener == "function",
  ln = [];
Tr &&
  addEventListener(
    "offline",
    () => {
      ln.forEach((e) => e());
    },
    !1
  );
class Ge extends Z {
  constructor(t, n) {
    if (
      (super(),
      (this.binaryType = Ju),
      (this.writeBuffer = []),
      (this._prevBufferLen = 0),
      (this._pingInterval = -1),
      (this._pingTimeout = -1),
      (this._maxPayload = -1),
      (this._pingTimeoutTime = 1 / 0),
      t && typeof t == "object" && ((n = t), (t = null)),
      t)
    ) {
      const r = Er(t);
      (n.hostname = r.host),
        (n.secure = r.protocol === "https" || r.protocol === "wss"),
        (n.port = r.port),
        r.query && (n.query = r.query);
    } else n.host && (n.hostname = Er(n.host).host);
    Rn(this, n),
      (this.secure =
        n.secure != null
          ? n.secure
          : typeof location < "u" && location.protocol === "https:"),
      n.hostname && !n.port && (n.port = this.secure ? "443" : "80"),
      (this.hostname =
        n.hostname ||
        (typeof location < "u" ? location.hostname : "localhost")),
      (this.port =
        n.port ||
        (typeof location < "u" && location.port
          ? location.port
          : this.secure
          ? "443"
          : "80")),
      (this.transports = []),
      (this._transportsByName = {}),
      n.transports.forEach((r) => {
        const s = r.prototype.name;
        this.transports.push(s), (this._transportsByName[s] = r);
      }),
      (this.opts = Object.assign(
        {
          path: "/engine.io",
          agent: !1,
          withCredentials: !1,
          upgrade: !0,
          timestampParam: "t",
          rememberUpgrade: !1,
          addTrailingSlash: !0,
          rejectUnauthorized: !0,
          perMessageDeflate: { threshold: 1024 },
          transportOptions: {},
          closeOnBeforeunload: !1,
        },
        n
      )),
      (this.opts.path =
        this.opts.path.replace(/\/$/, "") +
        (this.opts.addTrailingSlash ? "/" : "")),
      typeof this.opts.query == "string" &&
        (this.opts.query = nd(this.opts.query)),
      Tr &&
        (this.opts.closeOnBeforeunload &&
          ((this._beforeunloadEventListener = () => {
            this.transport &&
              (this.transport.removeAllListeners(), this.transport.close());
          }),
          addEventListener(
            "beforeunload",
            this._beforeunloadEventListener,
            !1
          )),
        this.hostname !== "localhost" &&
          ((this._offlineEventListener = () => {
            this._onClose("transport close", {
              description: "network connection lost",
            });
          }),
          ln.push(this._offlineEventListener))),
      this.opts.withCredentials && (this._cookieJar = void 0),
      this._open();
  }
  createTransport(t) {
    const n = Object.assign({}, this.opts.query);
    (n.EIO = Ti), (n.transport = t), this.id && (n.sid = this.id);
    const r = Object.assign(
      {},
      this.opts,
      {
        query: n,
        socket: this,
        hostname: this.hostname,
        secure: this.secure,
        port: this.port,
      },
      this.opts.transportOptions[t]
    );
    return new this._transportsByName[t](r);
  }
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const t =
      this.opts.rememberUpgrade &&
      Ge.priorWebsocketSuccess &&
      this.transports.indexOf("websocket") !== -1
        ? "websocket"
        : this.transports[0];
    this.readyState = "opening";
    const n = this.createTransport(t);
    n.open(), this.setTransport(n);
  }
  setTransport(t) {
    this.transport && this.transport.removeAllListeners(),
      (this.transport = t),
      t
        .on("drain", this._onDrain.bind(this))
        .on("packet", this._onPacket.bind(this))
        .on("error", this._onError.bind(this))
        .on("close", (n) => this._onClose("transport close", n));
  }
  onOpen() {
    (this.readyState = "open"),
      (Ge.priorWebsocketSuccess = this.transport.name === "websocket"),
      this.emitReserved("open"),
      this.flush();
  }
  _onPacket(t) {
    if (
      this.readyState === "opening" ||
      this.readyState === "open" ||
      this.readyState === "closing"
    )
      switch (
        (this.emitReserved("packet", t), this.emitReserved("heartbeat"), t.type)
      ) {
        case "open":
          this.onHandshake(JSON.parse(t.data));
          break;
        case "ping":
          this._sendPacket("pong"),
            this.emitReserved("ping"),
            this.emitReserved("pong"),
            this._resetPingTimeout();
          break;
        case "error":
          const n = new Error("server error");
          (n.code = t.data), this._onError(n);
          break;
        case "message":
          this.emitReserved("data", t.data),
            this.emitReserved("message", t.data);
          break;
      }
  }
  onHandshake(t) {
    this.emitReserved("handshake", t),
      (this.id = t.sid),
      (this.transport.query.sid = t.sid),
      (this._pingInterval = t.pingInterval),
      (this._pingTimeout = t.pingTimeout),
      (this._maxPayload = t.maxPayload),
      this.onOpen(),
      this.readyState !== "closed" && this._resetPingTimeout();
  }
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const t = this._pingInterval + this._pingTimeout;
    (this._pingTimeoutTime = Date.now() + t),
      (this._pingTimeoutTimer = this.setTimeoutFn(() => {
        this._onClose("ping timeout");
      }, t)),
      this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen),
      (this._prevBufferLen = 0),
      this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  flush() {
    if (
      this.readyState !== "closed" &&
      this.transport.writable &&
      !this.upgrading &&
      this.writeBuffer.length
    ) {
      const t = this._getWritablePackets();
      this.transport.send(t),
        (this._prevBufferLen = t.length),
        this.emitReserved("flush");
    }
  }
  _getWritablePackets() {
    if (
      !(
        this._maxPayload &&
        this.transport.name === "polling" &&
        this.writeBuffer.length > 1
      )
    )
      return this.writeBuffer;
    let n = 1;
    for (let r = 0; r < this.writeBuffer.length; r++) {
      const s = this.writeBuffer[r].data;
      if ((s && (n += Zu(s)), r > 0 && n > this._maxPayload))
        return this.writeBuffer.slice(0, r);
      n += 2;
    }
    return this.writeBuffer;
  }
  _hasPingExpired() {
    if (!this._pingTimeoutTime) return !0;
    const t = Date.now() > this._pingTimeoutTime;
    return (
      t &&
        ((this._pingTimeoutTime = 0),
        kn(() => {
          this._onClose("ping timeout");
        }, this.setTimeoutFn)),
      t
    );
  }
  write(t, n, r) {
    return this._sendPacket("message", t, n, r), this;
  }
  send(t, n, r) {
    return this._sendPacket("message", t, n, r), this;
  }
  _sendPacket(t, n, r, s) {
    if (
      (typeof n == "function" && ((s = n), (n = void 0)),
      typeof r == "function" && ((s = r), (r = null)),
      this.readyState === "closing" || this.readyState === "closed")
    )
      return;
    (r = r || {}), (r.compress = r.compress !== !1);
    const a = { type: t, data: n, options: r };
    this.emitReserved("packetCreate", a),
      this.writeBuffer.push(a),
      s && this.once("flush", s),
      this.flush();
  }
  close() {
    const t = () => {
        this._onClose("forced close"), this.transport.close();
      },
      n = () => {
        this.off("upgrade", n), this.off("upgradeError", n), t();
      },
      r = () => {
        this.once("upgrade", n), this.once("upgradeError", n);
      };
    return (
      (this.readyState === "opening" || this.readyState === "open") &&
        ((this.readyState = "closing"),
        this.writeBuffer.length
          ? this.once("drain", () => {
              this.upgrading ? r() : t();
            })
          : this.upgrading
          ? r()
          : t()),
      this
    );
  }
  _onError(t) {
    if (
      ((Ge.priorWebsocketSuccess = !1),
      this.opts.tryAllTransports &&
        this.transports.length > 1 &&
        this.readyState === "opening")
    )
      return this.transports.shift(), this._open();
    this.emitReserved("error", t), this._onClose("transport error", t);
  }
  _onClose(t, n) {
    if (
      this.readyState === "opening" ||
      this.readyState === "open" ||
      this.readyState === "closing"
    ) {
      if (
        (this.clearTimeoutFn(this._pingTimeoutTimer),
        this.transport.removeAllListeners("close"),
        this.transport.close(),
        this.transport.removeAllListeners(),
        Tr &&
          (this._beforeunloadEventListener &&
            removeEventListener(
              "beforeunload",
              this._beforeunloadEventListener,
              !1
            ),
          this._offlineEventListener))
      ) {
        const r = ln.indexOf(this._offlineEventListener);
        r !== -1 && ln.splice(r, 1);
      }
      (this.readyState = "closed"),
        (this.id = null),
        this.emitReserved("close", t, n),
        (this.writeBuffer = []),
        (this._prevBufferLen = 0);
    }
  }
}
Ge.protocol = Ti;
class vd extends Ge {
  constructor() {
    super(...arguments), (this._upgrades = []);
  }
  onOpen() {
    if ((super.onOpen(), this.readyState === "open" && this.opts.upgrade))
      for (let t = 0; t < this._upgrades.length; t++)
        this._probe(this._upgrades[t]);
  }
  _probe(t) {
    let n = this.createTransport(t),
      r = !1;
    Ge.priorWebsocketSuccess = !1;
    const s = () => {
      r ||
        (n.send([{ type: "ping", data: "probe" }]),
        n.once("packet", (h) => {
          if (!r)
            if (h.type === "pong" && h.data === "probe") {
              if (
                ((this.upgrading = !0), this.emitReserved("upgrading", n), !n)
              )
                return;
              (Ge.priorWebsocketSuccess = n.name === "websocket"),
                this.transport.pause(() => {
                  r ||
                    (this.readyState !== "closed" &&
                      (d(),
                      this.setTransport(n),
                      n.send([{ type: "upgrade" }]),
                      this.emitReserved("upgrade", n),
                      (n = null),
                      (this.upgrading = !1),
                      this.flush()));
                });
            } else {
              const p = new Error("probe error");
              (p.transport = n.name), this.emitReserved("upgradeError", p);
            }
        }));
    };
    function a() {
      r || ((r = !0), d(), n.close(), (n = null));
    }
    const o = (h) => {
      const p = new Error("probe error: " + h);
      (p.transport = n.name), a(), this.emitReserved("upgradeError", p);
    };
    function c() {
      o("transport closed");
    }
    function l() {
      o("socket closed");
    }
    function u(h) {
      n && h.name !== n.name && a();
    }
    const d = () => {
      n.removeListener("open", s),
        n.removeListener("error", o),
        n.removeListener("close", c),
        this.off("close", l),
        this.off("upgrading", u);
    };
    n.once("open", s),
      n.once("error", o),
      n.once("close", c),
      this.once("close", l),
      this.once("upgrading", u),
      this._upgrades.indexOf("webtransport") !== -1 && t !== "webtransport"
        ? this.setTimeoutFn(() => {
            r || n.open();
          }, 200)
        : n.open();
  }
  onHandshake(t) {
    (this._upgrades = this._filterUpgrades(t.upgrades)), super.onHandshake(t);
  }
  _filterUpgrades(t) {
    const n = [];
    for (let r = 0; r < t.length; r++)
      ~this.transports.indexOf(t[r]) && n.push(t[r]);
    return n;
  }
}
let xd = class extends vd {
  constructor(t, n = {}) {
    const r = typeof t == "object" ? t : n;
    (!r.transports || (r.transports && typeof r.transports[0] == "string")) &&
      (r.transports = (r.transports || ["polling", "websocket", "webtransport"])
        .map((s) => fd[s])
        .filter((s) => !!s)),
      super(t, r);
  }
};
function bd(e, t = "", n) {
  let r = e;
  (n = n || (typeof location < "u" && location)),
    e == null && (e = n.protocol + "//" + n.host),
    typeof e == "string" &&
      (e.charAt(0) === "/" &&
        (e.charAt(1) === "/" ? (e = n.protocol + e) : (e = n.host + e)),
      /^(https?|wss?):\/\//.test(e) ||
        (typeof n < "u" ? (e = n.protocol + "//" + e) : (e = "https://" + e)),
      (r = Er(e))),
    r.port ||
      (/^(http|ws)$/.test(r.protocol)
        ? (r.port = "80")
        : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")),
    (r.path = r.path || "/");
  const a = r.host.indexOf(":") !== -1 ? "[" + r.host + "]" : r.host;
  return (
    (r.id = r.protocol + "://" + a + ":" + r.port + t),
    (r.href =
      r.protocol + "://" + a + (n && n.port === r.port ? "" : ":" + r.port)),
    r
  );
}
const wd = typeof ArrayBuffer == "function",
  Nd = (e) =>
    typeof ArrayBuffer.isView == "function"
      ? ArrayBuffer.isView(e)
      : e.buffer instanceof ArrayBuffer,
  Ai = Object.prototype.toString,
  Ed =
    typeof Blob == "function" ||
    (typeof Blob < "u" && Ai.call(Blob) === "[object BlobConstructor]"),
  Td =
    typeof File == "function" ||
    (typeof File < "u" && Ai.call(File) === "[object FileConstructor]");
function ns(e) {
  return (
    (wd && (e instanceof ArrayBuffer || Nd(e))) ||
    (Ed && e instanceof Blob) ||
    (Td && e instanceof File)
  );
}
function un(e, t) {
  if (!e || typeof e != "object") return !1;
  if (Array.isArray(e)) {
    for (let n = 0, r = e.length; n < r; n++) if (un(e[n])) return !0;
    return !1;
  }
  if (ns(e)) return !0;
  if (e.toJSON && typeof e.toJSON == "function" && arguments.length === 1)
    return un(e.toJSON(), !0);
  for (const n in e)
    if (Object.prototype.hasOwnProperty.call(e, n) && un(e[n])) return !0;
  return !1;
}
function Sd(e) {
  const t = [],
    n = e.data,
    r = e;
  return (
    (r.data = Sr(n, t)), (r.attachments = t.length), { packet: r, buffers: t }
  );
}
function Sr(e, t) {
  if (!e) return e;
  if (ns(e)) {
    const n = { _placeholder: !0, num: t.length };
    return t.push(e), n;
  } else if (Array.isArray(e)) {
    const n = new Array(e.length);
    for (let r = 0; r < e.length; r++) n[r] = Sr(e[r], t);
    return n;
  } else if (typeof e == "object" && !(e instanceof Date)) {
    const n = {};
    for (const r in e)
      Object.prototype.hasOwnProperty.call(e, r) && (n[r] = Sr(e[r], t));
    return n;
  }
  return e;
}
function jd(e, t) {
  return (e.data = jr(e.data, t)), delete e.attachments, e;
}
function jr(e, t) {
  if (!e) return e;
  if (e && e._placeholder === !0) {
    if (typeof e.num == "number" && e.num >= 0 && e.num < t.length)
      return t[e.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(e))
    for (let n = 0; n < e.length; n++) e[n] = jr(e[n], t);
  else if (typeof e == "object")
    for (const n in e)
      Object.prototype.hasOwnProperty.call(e, n) && (e[n] = jr(e[n], t));
  return e;
}
const _d = [
    "connect",
    "connect_error",
    "disconnect",
    "disconnecting",
    "newListener",
    "removeListener",
  ],
  Cd = 5;
var F;
(function (e) {
  (e[(e.CONNECT = 0)] = "CONNECT"),
    (e[(e.DISCONNECT = 1)] = "DISCONNECT"),
    (e[(e.EVENT = 2)] = "EVENT"),
    (e[(e.ACK = 3)] = "ACK"),
    (e[(e.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
    (e[(e.BINARY_EVENT = 5)] = "BINARY_EVENT"),
    (e[(e.BINARY_ACK = 6)] = "BINARY_ACK");
})(F || (F = {}));
class Od {
  constructor(t) {
    this.replacer = t;
  }
  encode(t) {
    return (t.type === F.EVENT || t.type === F.ACK) && un(t)
      ? this.encodeAsBinary({
          type: t.type === F.EVENT ? F.BINARY_EVENT : F.BINARY_ACK,
          nsp: t.nsp,
          data: t.data,
          id: t.id,
        })
      : [this.encodeAsString(t)];
  }
  encodeAsString(t) {
    let n = "" + t.type;
    return (
      (t.type === F.BINARY_EVENT || t.type === F.BINARY_ACK) &&
        (n += t.attachments + "-"),
      t.nsp && t.nsp !== "/" && (n += t.nsp + ","),
      t.id != null && (n += t.id),
      t.data != null && (n += JSON.stringify(t.data, this.replacer)),
      n
    );
  }
  encodeAsBinary(t) {
    const n = Sd(t),
      r = this.encodeAsString(n.packet),
      s = n.buffers;
    return s.unshift(r), s;
  }
}
function ea(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
class rs extends Z {
  constructor(t) {
    super(), (this.reviver = t);
  }
  add(t) {
    let n;
    if (typeof t == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      n = this.decodeString(t);
      const r = n.type === F.BINARY_EVENT;
      r || n.type === F.BINARY_ACK
        ? ((n.type = r ? F.EVENT : F.ACK),
          (this.reconstructor = new Ad(n)),
          n.attachments === 0 && super.emitReserved("decoded", n))
        : super.emitReserved("decoded", n);
    } else if (ns(t) || t.base64)
      if (this.reconstructor)
        (n = this.reconstructor.takeBinaryData(t)),
          n && ((this.reconstructor = null), super.emitReserved("decoded", n));
      else throw new Error("got binary data when not reconstructing a packet");
    else throw new Error("Unknown type: " + t);
  }
  decodeString(t) {
    let n = 0;
    const r = { type: Number(t.charAt(0)) };
    if (F[r.type] === void 0) throw new Error("unknown packet type " + r.type);
    if (r.type === F.BINARY_EVENT || r.type === F.BINARY_ACK) {
      const a = n + 1;
      for (; t.charAt(++n) !== "-" && n != t.length; );
      const o = t.substring(a, n);
      if (o != Number(o) || t.charAt(n) !== "-")
        throw new Error("Illegal attachments");
      r.attachments = Number(o);
    }
    if (t.charAt(n + 1) === "/") {
      const a = n + 1;
      for (; ++n && !(t.charAt(n) === "," || n === t.length); );
      r.nsp = t.substring(a, n);
    } else r.nsp = "/";
    const s = t.charAt(n + 1);
    if (s !== "" && Number(s) == s) {
      const a = n + 1;
      for (; ++n; ) {
        const o = t.charAt(n);
        if (o == null || Number(o) != o) {
          --n;
          break;
        }
        if (n === t.length) break;
      }
      r.id = Number(t.substring(a, n + 1));
    }
    if (t.charAt(++n)) {
      const a = this.tryParse(t.substr(n));
      if (rs.isPayloadValid(r.type, a)) r.data = a;
      else throw new Error("invalid payload");
    }
    return r;
  }
  tryParse(t) {
    try {
      return JSON.parse(t, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(t, n) {
    switch (t) {
      case F.CONNECT:
        return ea(n);
      case F.DISCONNECT:
        return n === void 0;
      case F.CONNECT_ERROR:
        return typeof n == "string" || ea(n);
      case F.EVENT:
      case F.BINARY_EVENT:
        return (
          Array.isArray(n) &&
          (typeof n[0] == "number" ||
            (typeof n[0] == "string" && _d.indexOf(n[0]) === -1))
        );
      case F.ACK:
      case F.BINARY_ACK:
        return Array.isArray(n);
    }
  }
  destroy() {
    this.reconstructor &&
      (this.reconstructor.finishedReconstruction(),
      (this.reconstructor = null));
  }
}
class Ad {
  constructor(t) {
    (this.packet = t), (this.buffers = []), (this.reconPack = t);
  }
  takeBinaryData(t) {
    if (
      (this.buffers.push(t), this.buffers.length === this.reconPack.attachments)
    ) {
      const n = jd(this.reconPack, this.buffers);
      return this.finishedReconstruction(), n;
    }
    return null;
  }
  finishedReconstruction() {
    (this.reconPack = null), (this.buffers = []);
  }
}
const kd = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      Decoder: rs,
      Encoder: Od,
      get PacketType() {
        return F;
      },
      protocol: Cd,
    },
    Symbol.toStringTag,
    { value: "Module" }
  )
);
function Ie(e, t, n) {
  return (
    e.on(t, n),
    function () {
      e.off(t, n);
    }
  );
}
const Rd = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  newListener: 1,
  removeListener: 1,
});
class ki extends Z {
  constructor(t, n, r) {
    super(),
      (this.connected = !1),
      (this.recovered = !1),
      (this.receiveBuffer = []),
      (this.sendBuffer = []),
      (this._queue = []),
      (this._queueSeq = 0),
      (this.ids = 0),
      (this.acks = {}),
      (this.flags = {}),
      (this.io = t),
      (this.nsp = n),
      r && r.auth && (this.auth = r.auth),
      (this._opts = Object.assign({}, r)),
      this.io._autoConnect && this.open();
  }
  get disconnected() {
    return !this.connected;
  }
  subEvents() {
    if (this.subs) return;
    const t = this.io;
    this.subs = [
      Ie(t, "open", this.onopen.bind(this)),
      Ie(t, "packet", this.onpacket.bind(this)),
      Ie(t, "error", this.onerror.bind(this)),
      Ie(t, "close", this.onclose.bind(this)),
    ];
  }
  get active() {
    return !!this.subs;
  }
  connect() {
    return this.connected
      ? this
      : (this.subEvents(),
        this.io._reconnecting || this.io.open(),
        this.io._readyState === "open" && this.onopen(),
        this);
  }
  open() {
    return this.connect();
  }
  send(...t) {
    return t.unshift("message"), this.emit.apply(this, t), this;
  }
  emit(t, ...n) {
    var r, s, a;
    if (Rd.hasOwnProperty(t))
      throw new Error('"' + t.toString() + '" is a reserved event name');
    if (
      (n.unshift(t),
      this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
    )
      return this._addToQueue(n), this;
    const o = { type: F.EVENT, data: n };
    if (
      ((o.options = {}),
      (o.options.compress = this.flags.compress !== !1),
      typeof n[n.length - 1] == "function")
    ) {
      const d = this.ids++,
        h = n.pop();
      this._registerAckCallback(d, h), (o.id = d);
    }
    const c =
        (s =
          (r = this.io.engine) === null || r === void 0
            ? void 0
            : r.transport) === null || s === void 0
          ? void 0
          : s.writable,
      l =
        this.connected &&
        !(
          !((a = this.io.engine) === null || a === void 0) &&
          a._hasPingExpired()
        );
    return (
      (this.flags.volatile && !c) ||
        (l
          ? (this.notifyOutgoingListeners(o), this.packet(o))
          : this.sendBuffer.push(o)),
      (this.flags = {}),
      this
    );
  }
  _registerAckCallback(t, n) {
    var r;
    const s =
      (r = this.flags.timeout) !== null && r !== void 0
        ? r
        : this._opts.ackTimeout;
    if (s === void 0) {
      this.acks[t] = n;
      return;
    }
    const a = this.io.setTimeoutFn(() => {
        delete this.acks[t];
        for (let c = 0; c < this.sendBuffer.length; c++)
          this.sendBuffer[c].id === t && this.sendBuffer.splice(c, 1);
        n.call(this, new Error("operation has timed out"));
      }, s),
      o = (...c) => {
        this.io.clearTimeoutFn(a), n.apply(this, c);
      };
    (o.withError = !0), (this.acks[t] = o);
  }
  emitWithAck(t, ...n) {
    return new Promise((r, s) => {
      const a = (o, c) => (o ? s(o) : r(c));
      (a.withError = !0), n.push(a), this.emit(t, ...n);
    });
  }
  _addToQueue(t) {
    let n;
    typeof t[t.length - 1] == "function" && (n = t.pop());
    const r = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: t,
      flags: Object.assign({ fromQueue: !0 }, this.flags),
    };
    t.push((s, ...a) =>
      r !== this._queue[0]
        ? void 0
        : (s !== null
            ? r.tryCount > this._opts.retries &&
              (this._queue.shift(), n && n(s))
            : (this._queue.shift(), n && n(null, ...a)),
          (r.pending = !1),
          this._drainQueue())
    ),
      this._queue.push(r),
      this._drainQueue();
  }
  _drainQueue(t = !1) {
    if (!this.connected || this._queue.length === 0) return;
    const n = this._queue[0];
    (n.pending && !t) ||
      ((n.pending = !0),
      n.tryCount++,
      (this.flags = n.flags),
      this.emit.apply(this, n.args));
  }
  packet(t) {
    (t.nsp = this.nsp), this.io._packet(t);
  }
  onopen() {
    typeof this.auth == "function"
      ? this.auth((t) => {
          this._sendConnectPacket(t);
        })
      : this._sendConnectPacket(this.auth);
  }
  _sendConnectPacket(t) {
    this.packet({
      type: F.CONNECT,
      data: this._pid
        ? Object.assign({ pid: this._pid, offset: this._lastOffset }, t)
        : t,
    });
  }
  onerror(t) {
    this.connected || this.emitReserved("connect_error", t);
  }
  onclose(t, n) {
    (this.connected = !1),
      delete this.id,
      this.emitReserved("disconnect", t, n),
      this._clearAcks();
  }
  _clearAcks() {
    Object.keys(this.acks).forEach((t) => {
      if (!this.sendBuffer.some((r) => String(r.id) === t)) {
        const r = this.acks[t];
        delete this.acks[t],
          r.withError &&
            r.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  onpacket(t) {
    if (t.nsp === this.nsp)
      switch (t.type) {
        case F.CONNECT:
          t.data && t.data.sid
            ? this.onconnect(t.data.sid, t.data.pid)
            : this.emitReserved(
                "connect_error",
                new Error(
                  "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"
                )
              );
          break;
        case F.EVENT:
        case F.BINARY_EVENT:
          this.onevent(t);
          break;
        case F.ACK:
        case F.BINARY_ACK:
          this.onack(t);
          break;
        case F.DISCONNECT:
          this.ondisconnect();
          break;
        case F.CONNECT_ERROR:
          this.destroy();
          const r = new Error(t.data.message);
          (r.data = t.data.data), this.emitReserved("connect_error", r);
          break;
      }
  }
  onevent(t) {
    const n = t.data || [];
    t.id != null && n.push(this.ack(t.id)),
      this.connected
        ? this.emitEvent(n)
        : this.receiveBuffer.push(Object.freeze(n));
  }
  emitEvent(t) {
    if (this._anyListeners && this._anyListeners.length) {
      const n = this._anyListeners.slice();
      for (const r of n) r.apply(this, t);
    }
    super.emit.apply(this, t),
      this._pid &&
        t.length &&
        typeof t[t.length - 1] == "string" &&
        (this._lastOffset = t[t.length - 1]);
  }
  ack(t) {
    const n = this;
    let r = !1;
    return function (...s) {
      r || ((r = !0), n.packet({ type: F.ACK, id: t, data: s }));
    };
  }
  onack(t) {
    const n = this.acks[t.id];
    typeof n == "function" &&
      (delete this.acks[t.id],
      n.withError && t.data.unshift(null),
      n.apply(this, t.data));
  }
  onconnect(t, n) {
    (this.id = t),
      (this.recovered = n && this._pid === n),
      (this._pid = n),
      (this.connected = !0),
      this.emitBuffered(),
      this.emitReserved("connect"),
      this._drainQueue(!0);
  }
  emitBuffered() {
    this.receiveBuffer.forEach((t) => this.emitEvent(t)),
      (this.receiveBuffer = []),
      this.sendBuffer.forEach((t) => {
        this.notifyOutgoingListeners(t), this.packet(t);
      }),
      (this.sendBuffer = []);
  }
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  destroy() {
    this.subs && (this.subs.forEach((t) => t()), (this.subs = void 0)),
      this.io._destroy(this);
  }
  disconnect() {
    return (
      this.connected && this.packet({ type: F.DISCONNECT }),
      this.destroy(),
      this.connected && this.onclose("io client disconnect"),
      this
    );
  }
  close() {
    return this.disconnect();
  }
  compress(t) {
    return (this.flags.compress = t), this;
  }
  get volatile() {
    return (this.flags.volatile = !0), this;
  }
  timeout(t) {
    return (this.flags.timeout = t), this;
  }
  onAny(t) {
    return (
      (this._anyListeners = this._anyListeners || []),
      this._anyListeners.push(t),
      this
    );
  }
  prependAny(t) {
    return (
      (this._anyListeners = this._anyListeners || []),
      this._anyListeners.unshift(t),
      this
    );
  }
  offAny(t) {
    if (!this._anyListeners) return this;
    if (t) {
      const n = this._anyListeners;
      for (let r = 0; r < n.length; r++)
        if (t === n[r]) return n.splice(r, 1), this;
    } else this._anyListeners = [];
    return this;
  }
  listenersAny() {
    return this._anyListeners || [];
  }
  onAnyOutgoing(t) {
    return (
      (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
      this._anyOutgoingListeners.push(t),
      this
    );
  }
  prependAnyOutgoing(t) {
    return (
      (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
      this._anyOutgoingListeners.unshift(t),
      this
    );
  }
  offAnyOutgoing(t) {
    if (!this._anyOutgoingListeners) return this;
    if (t) {
      const n = this._anyOutgoingListeners;
      for (let r = 0; r < n.length; r++)
        if (t === n[r]) return n.splice(r, 1), this;
    } else this._anyOutgoingListeners = [];
    return this;
  }
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  notifyOutgoingListeners(t) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const n = this._anyOutgoingListeners.slice();
      for (const r of n) r.apply(this, t.data);
    }
  }
}
function xt(e) {
  (e = e || {}),
    (this.ms = e.min || 100),
    (this.max = e.max || 1e4),
    (this.factor = e.factor || 2),
    (this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0),
    (this.attempts = 0);
}
xt.prototype.duration = function () {
  var e = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var t = Math.random(),
      n = Math.floor(t * this.jitter * e);
    e = Math.floor(t * 10) & 1 ? e + n : e - n;
  }
  return Math.min(e, this.max) | 0;
};
xt.prototype.reset = function () {
  this.attempts = 0;
};
xt.prototype.setMin = function (e) {
  this.ms = e;
};
xt.prototype.setMax = function (e) {
  this.max = e;
};
xt.prototype.setJitter = function (e) {
  this.jitter = e;
};
class _r extends Z {
  constructor(t, n) {
    var r;
    super(),
      (this.nsps = {}),
      (this.subs = []),
      t && typeof t == "object" && ((n = t), (t = void 0)),
      (n = n || {}),
      (n.path = n.path || "/socket.io"),
      (this.opts = n),
      Rn(this, n),
      this.reconnection(n.reconnection !== !1),
      this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0),
      this.reconnectionDelay(n.reconnectionDelay || 1e3),
      this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3),
      this.randomizationFactor(
        (r = n.randomizationFactor) !== null && r !== void 0 ? r : 0.5
      ),
      (this.backoff = new xt({
        min: this.reconnectionDelay(),
        max: this.reconnectionDelayMax(),
        jitter: this.randomizationFactor(),
      })),
      this.timeout(n.timeout == null ? 2e4 : n.timeout),
      (this._readyState = "closed"),
      (this.uri = t);
    const s = n.parser || kd;
    (this.encoder = new s.Encoder()),
      (this.decoder = new s.Decoder()),
      (this._autoConnect = n.autoConnect !== !1),
      this._autoConnect && this.open();
  }
  reconnection(t) {
    return arguments.length
      ? ((this._reconnection = !!t), t || (this.skipReconnect = !0), this)
      : this._reconnection;
  }
  reconnectionAttempts(t) {
    return t === void 0
      ? this._reconnectionAttempts
      : ((this._reconnectionAttempts = t), this);
  }
  reconnectionDelay(t) {
    var n;
    return t === void 0
      ? this._reconnectionDelay
      : ((this._reconnectionDelay = t),
        (n = this.backoff) === null || n === void 0 || n.setMin(t),
        this);
  }
  randomizationFactor(t) {
    var n;
    return t === void 0
      ? this._randomizationFactor
      : ((this._randomizationFactor = t),
        (n = this.backoff) === null || n === void 0 || n.setJitter(t),
        this);
  }
  reconnectionDelayMax(t) {
    var n;
    return t === void 0
      ? this._reconnectionDelayMax
      : ((this._reconnectionDelayMax = t),
        (n = this.backoff) === null || n === void 0 || n.setMax(t),
        this);
  }
  timeout(t) {
    return arguments.length ? ((this._timeout = t), this) : this._timeout;
  }
  maybeReconnectOnOpen() {
    !this._reconnecting &&
      this._reconnection &&
      this.backoff.attempts === 0 &&
      this.reconnect();
  }
  open(t) {
    if (~this._readyState.indexOf("open")) return this;
    this.engine = new xd(this.uri, this.opts);
    const n = this.engine,
      r = this;
    (this._readyState = "opening"), (this.skipReconnect = !1);
    const s = Ie(n, "open", function () {
        r.onopen(), t && t();
      }),
      a = (c) => {
        this.cleanup(),
          (this._readyState = "closed"),
          this.emitReserved("error", c),
          t ? t(c) : this.maybeReconnectOnOpen();
      },
      o = Ie(n, "error", a);
    if (this._timeout !== !1) {
      const c = this._timeout,
        l = this.setTimeoutFn(() => {
          s(), a(new Error("timeout")), n.close();
        }, c);
      this.opts.autoUnref && l.unref(),
        this.subs.push(() => {
          this.clearTimeoutFn(l);
        });
    }
    return this.subs.push(s), this.subs.push(o), this;
  }
  connect(t) {
    return this.open(t);
  }
  onopen() {
    this.cleanup(), (this._readyState = "open"), this.emitReserved("open");
    const t = this.engine;
    this.subs.push(
      Ie(t, "ping", this.onping.bind(this)),
      Ie(t, "data", this.ondata.bind(this)),
      Ie(t, "error", this.onerror.bind(this)),
      Ie(t, "close", this.onclose.bind(this)),
      Ie(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  onping() {
    this.emitReserved("ping");
  }
  ondata(t) {
    try {
      this.decoder.add(t);
    } catch (n) {
      this.onclose("parse error", n);
    }
  }
  ondecoded(t) {
    kn(() => {
      this.emitReserved("packet", t);
    }, this.setTimeoutFn);
  }
  onerror(t) {
    this.emitReserved("error", t);
  }
  socket(t, n) {
    let r = this.nsps[t];
    return (
      r
        ? this._autoConnect && !r.active && r.connect()
        : ((r = new ki(this, t, n)), (this.nsps[t] = r)),
      r
    );
  }
  _destroy(t) {
    const n = Object.keys(this.nsps);
    for (const r of n) if (this.nsps[r].active) return;
    this._close();
  }
  _packet(t) {
    const n = this.encoder.encode(t);
    for (let r = 0; r < n.length; r++) this.engine.write(n[r], t.options);
  }
  cleanup() {
    this.subs.forEach((t) => t()),
      (this.subs.length = 0),
      this.decoder.destroy();
  }
  _close() {
    (this.skipReconnect = !0),
      (this._reconnecting = !1),
      this.onclose("forced close");
  }
  disconnect() {
    return this._close();
  }
  onclose(t, n) {
    var r;
    this.cleanup(),
      (r = this.engine) === null || r === void 0 || r.close(),
      this.backoff.reset(),
      (this._readyState = "closed"),
      this.emitReserved("close", t, n),
      this._reconnection && !this.skipReconnect && this.reconnect();
  }
  reconnect() {
    if (this._reconnecting || this.skipReconnect) return this;
    const t = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(),
        this.emitReserved("reconnect_failed"),
        (this._reconnecting = !1);
    else {
      const n = this.backoff.duration();
      this._reconnecting = !0;
      const r = this.setTimeoutFn(() => {
        t.skipReconnect ||
          (this.emitReserved("reconnect_attempt", t.backoff.attempts),
          !t.skipReconnect &&
            t.open((s) => {
              s
                ? ((t._reconnecting = !1),
                  t.reconnect(),
                  this.emitReserved("reconnect_error", s))
                : t.onreconnect();
            }));
      }, n);
      this.opts.autoUnref && r.unref(),
        this.subs.push(() => {
          this.clearTimeoutFn(r);
        });
    }
  }
  onreconnect() {
    const t = this.backoff.attempts;
    (this._reconnecting = !1),
      this.backoff.reset(),
      this.emitReserved("reconnect", t);
  }
}
const Tt = {};
function dn(e, t) {
  typeof e == "object" && ((t = e), (e = void 0)), (t = t || {});
  const n = bd(e, t.path || "/socket.io"),
    r = n.source,
    s = n.id,
    a = n.path,
    o = Tt[s] && a in Tt[s].nsps,
    c = t.forceNew || t["force new connection"] || t.multiplex === !1 || o;
  let l;
  return (
    c ? (l = new _r(r, t)) : (Tt[s] || (Tt[s] = new _r(r, t)), (l = Tt[s])),
    n.query && !t.query && (t.query = n.queryKey),
    l.socket(n.path, t)
  );
}
Object.assign(dn, { Manager: _r, Socket: ki, io: dn, connect: dn });
const Ri = y.createContext(),
  ta = dn(vi, {
    auth: { token: localStorage.access || "" },
    autoConnect: !!localStorage.access,
  }),
  Pd = ({ children: e }) => {
    const t = {
        name: "Sprintet",
        location: "/about",
        icon: "/sprintetS.png",
        pinned: !0,
        about: "About Sprintet",
        category: "default",
      },
      n = {
        name: "Files",
        location: "/fsexplorer",
        icon: "/icon.png",
        pinned: !0,
        about: "Sprintet File Explorer",
        category: "utility",
      },
      a = [
        t,
        n,
        {
          name: "Sprint OS",
          location: "/os",
          icon: "/os.png",
          pinned: !1,
          about: "Sprintet web Computer UI",
          category: "default",
        },
        {
          name: "Remote Input",
          location: "/touchpad",
          icon: "/touchpad.png",
          pinned: !0,
          about: "Remote touchpad for host machine",
          category: "utility",
        },
      ],
      o = Re(),
      [c, l] = Kc(),
      u = We(),
      [d, h] = y.useState([...a]),
      p = d.filter((C) => (C == null ? void 0 : C.pinned)),
      [x, v] = y.useState([]),
      [g, m] = y.useState([]),
      [w, T] = y.useState(!1),
      [N, _] = y.useState(""),
      [O, j] = y.useState(window.innerWidth),
      [f, E] = y.useState(""),
      [S, L] = y.useState([]),
      [k, A] = y.useState([]),
      [Te, te] = y.useState([]),
      [Ce, G] = y.useState(""),
      [de, he] = y.useState([]),
      [ae, z] = y.useState([]),
      [re, Y] = y.useState({
        top: scrollY,
        height: document.documentElement.scrollHeight,
      });
    async function K() {
      window.onresize = () => j(window.innerWidth);
    }
    async function ne(C, R, M) {
      v((Se) => Se.map((Oe) => (Oe.location == C ? { ...Oe, [R]: M } : Oe)));
    }
    function ie() {
      const C = localStorage == null ? void 0 : localStorage.focused;
      setTimeout(() => {
        v((R) =>
          R.map((M) =>
            M.location == C ? { ...M, zIndex: 5 } : { ...M, zIndex: 3 }
          )
        );
      }, 600),
        setTimeout(() => {
          const R = document.getElementById("iframe-" + C);
          R && R.focus();
        }, 700);
    }
    async function me(C) {
      v((R) => R.filter((M) => M.location !== C));
    }
    const se = () => {
      const C = {
          width: 400,
          height: window.innerHeight - 90,
          x: window.innerWidth / 4,
          y: 10,
        },
        R = {
          width: window.innerWidth - 10,
          height: window.innerHeight - 60,
          x: 5,
          y: 5,
        };
      return window.innerWidth > 600 ? C : R;
    };
    async function Pe(C) {
      const R = d.find((M) => M.location == C);
      v((M) => [
        ...M,
        {
          ...R,
          ...se(),
          isMini: !1,
          zIndex: 3,
          x: window.innerWidth > 600 ? se().x + x.length * 10 : se().x,
          y: window.innerWidth > 600 ? se().y + x.length * 10 : se().y,
        },
      ]);
    }
    function Fe(C) {
      const R = x.find((M) => M.location == C);
      if (R)
        return (
          (localStorage.focused = R.location),
          R.zIndex < 5 ? ie() : ne(C, "isMini", !R.isMini)
        );
      Pe(C);
    }
    const ct = async () => {
      try {
        const C = await le.get("/hostname");
        E(C.data);
        const R = [...a];
        h(R);
        const M = c.get("a") || "",
          Se = R.find(
            (Oe) =>
              (Oe.name + "").toLowerCase() ==
              ("" + M.replace("%20", " ")).toLowerCase()
          );
        Se && (document.theApp = Se.location);
      } catch {}
    };
    async function Nt(C) {
      var R;
      try {
        const M = await le.post("/admin/rq/protectedroutes", { route: C });
        te(M.data);
      } catch (M) {
        P.error(
          i.jsx("div", {
            dangerouslySetInnerHTML: {
              __html: `${
                ((R = M == null ? void 0 : M.response) == null
                  ? void 0
                  : R.data) ||
                M.message ||
                "" + M
              }`,
            },
          })
        );
      }
    }
    const lt = async () => {
        var C;
        try {
          if (!confirm("Click OK to continue to password wizard")) return;
          const R = prompt("Enter current password"),
            M = prompt("Enter new passord"),
            Se = { oldpassword: R, newpassword: M };
          await le.post("/admin/rq/change-password", Se),
            await le.post("/admin/rq/logout"),
            (localStorage.access = ""),
            (u.pathname = "/");
        } catch (R) {
          P.error(
            i.jsx("div", {
              dangerouslySetInnerHTML: {
                __html: `${
                  ((C = R == null ? void 0 : R.response) == null
                    ? void 0
                    : C.data) ||
                  R.message ||
                  "" + R
                }`,
              },
            })
          );
        }
      },
      ut = async () => {
        try {
          const C = (await le.get("/admin/rq/config")).data;
          G(C.password),
            A(C.visitors),
            L(C.forbidden),
            te(C.protectedRoutes || []),
            he(C.devices || []);
        } catch (C) {
          localStorage.access &&
            (() => {
              var R;
              !("" + C.response.data).startsWith("<") &&
                P.error(
                  i.jsx("div", {
                    dangerouslySetInnerHTML: {
                      __html: `${
                        ((R = C == null ? void 0 : C.response) == null
                          ? void 0
                          : R.data) ||
                        C.message ||
                        "" + C
                      }`,
                    },
                  })
                ),
                C.response.status == 401 &&
                  (!("" + C.response.data).startsWith("<") &&
                    P.error("ERROR: Authoraization Error... Login to continue"),
                  o("/login"));
            })();
        }
      };
    return (
      y.useEffect(() => {
        (le.defaults.headers.common.Authorization =
          (localStorage == null ? void 0 : localStorage.access) || ""),
          K(),
          ct(),
          localStorage != null && localStorage.access && ut(),
          ta.on("netlog", (C) => {
            window.dispatchEvent(new CustomEvent("netlog", { detail: C }));
          }),
          (window.onscroll = () => {
            Y({
              top: scrollY,
              height:
                document.documentElement.scrollHeight - window.innerHeight,
            });
          }),
          setTimeout(() => {
            Y({
              top: scrollY,
              height:
                document.documentElement.scrollHeight - window.innerHeight,
            });
          }, 400);
      }, []),
      y.useEffect(() => {
        Y({
          top: scrollY,
          height: document.documentElement.scrollHeight - window.innerHeight,
        });
      }, [u]),
      y.useEffect(() => {
        const R = d.map((Oe) => Oe.category).filter((Oe) => !!Oe),
          Se = [...new Set([...R])];
        m(Se), document.theApp && (Pe(document.theApp), (document.theApp = ""));
      }, [d]),
      y.useEffect(() => {
        const C = x.find(
          (R) =>
            R.height >= window.innerHeight &&
            R.width >= window.innerWidth &&
            !R.isMini
        );
        T(!!C);
      }, [x]),
      i.jsx(Ri.Provider, {
        value: {
          apps: d,
          setApps: h,
          opened: x,
          setOpened: v,
          pinned: p,
          handleIconClick: Fe,
          upDateWindow: ne,
          killWindow: me,
          winIsFs: w,
          defaults: se,
          setToTop: ie,
          vw: O,
          openApp: Pe,
          sprintet: t,
          fsdiscover: n,
          fetchSrc: ct,
          categories: g,
          setCategories: m,
          pop: N,
          setPop: _,
          hostname: f,
          forbidden: S,
          setForbidden: L,
          visitors: k,
          setVisitors: A,
          password: Ce,
          setPassword: G,
          fetchConfig: ut,
          changePass: lt,
          protectedRoutes: Te,
          setProtectedRoutes: te,
          forbidroute: Nt,
          devices: de,
          setDevices: he,
          socket: ta,
          traffic: ae,
          setTraffic: z,
          scrollConfig: re,
          setScrollConfig: Y,
        },
        children: e,
      })
    );
  },
  _e = () => y.useContext(Ri),
  Pi = ({ app: e, handleClick: t = () => null, onTaskbar: n = !1 }) => {
    const { handleIconClick: r, opened: s } = _e(),
      a = s.find((o) => o.location == e.location);
    return i.jsxs("div", {
      draggable: !0,
      className: `app btn fs-5 ico px-1 my-auto me-1 ${a && "active"}`,
      style: { minWidth: "" },
      title: e.name,
      id: e.location,
      onClick: () => {
        r(e.location), t();
      },
      children: [
        i.jsx(Ne.LazyLoadImage, {
          draggable: !1,
          effect: "opacity",
          alt: e.name,
          src: e.icon,
          width: "35px",
          placeholder: i.jsx(Ee, {}),
          height: "35px",
        }),
        !n &&
          i.jsx("div", {
            children: i.jsx("div", {
              className: "small text-center text-light text-truncate-pro mt-1",
              style: { fontSize: ".65em", minWidth: "60px", maxWidth: "70px" },
              children: e.name,
            }),
          }),
        n &&
          (a == null ? void 0 : a.zIndex) &&
          !(a != null && a.isMini) &&
          i.jsx("hr", {
            className: "m-0",
            style: {
              position: "relative",
              top: "3px",
              border: `${
                (a == null ? void 0 : a.zIndex) == 5 ? 2 : 1
              }px solid #efefef80`,
              opacity: 1,
              borderRadius: "3px",
              transition: "all, .3s",
            },
          }),
      ],
    });
  };
function Di(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z",
        },
        child: [],
      },
    ],
  })(e);
}
function Dd(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm11-6h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-1 6h-4V5h4v4zm-9 4H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6H5v-4h4v4zm8-6c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z",
        },
        child: [],
      },
    ],
  })(e);
}
function na(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z",
        },
        child: [],
      },
    ],
  })(e);
}
function ra(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z",
        },
        child: [],
      },
    ],
  })(e);
}
function Li(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z",
        },
        child: [],
      },
    ],
  })(e);
}
function Ld(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M19.903 8.586a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.952.952 0 0 0-.051-.259c-.01-.032-.019-.063-.033-.093zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: { d: "M8 12h8v2H8zm0 4h8v2H8zm0-8h2v2H8z" },
        child: [],
      },
    ],
  })(e);
}
function bp(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z",
        },
        child: [],
      },
      { tag: "path", attr: { d: "M11 11h2v6h-2zm0-4h2v2h-2z" }, child: [] },
    ],
  })(e);
}
function Id(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M11.999 1.993C6.486 1.994 2 6.48 1.999 11.994c0 5.514 4.486 10 10.001 10 5.514-.001 10-4.487 10-10 0-5.514-4.486-10-10.001-10.001zM12 19.994c-4.412 0-8.001-3.589-8.001-8 .001-4.411 3.59-8 8-8.001C16.411 3.994 20 7.583 20 11.994c0 4.41-3.589 7.999-8 8z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "m12.012 7.989-4.005 4.005 4.005 4.004v-3.004h3.994v-2h-3.994z",
        },
        child: [],
      },
    ],
  })(e);
}
function Md(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: { d: "m13 3 3.293 3.293-7 7 1.414 1.414 7-7L21 11V3z" },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M19 19H5V5h7l-2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-5l-2-2v7z",
        },
        child: [],
      },
    ],
  })(e);
}
function Bd(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M12 2C9.243 2 7 4.243 7 7v2H6c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v2H9V7zm9.002 13H13v-2.278c.595-.347 1-.985 1-1.722 0-1.103-.897-2-2-2s-2 .897-2 2c0 .736.405 1.375 1 1.722V20H6v-9h12l.002 9z",
        },
        child: [],
      },
    ],
  })(e);
}
function Fd(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      { tag: "path", attr: { d: "m13 16 5-4-5-4v3H4v2h9z" }, child: [] },
      {
        tag: "path",
        attr: {
          d: "M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z",
        },
        child: [],
      },
    ],
  })(e);
}
function Hd(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      { tag: "path", attr: { d: "M16 13v-2H7V8l-5 4 5 4v-3z" }, child: [] },
      {
        tag: "path",
        attr: {
          d: "M20 3h-9c-1.103 0-2 .897-2 2v4h2V5h9v14h-9v-4H9v4c0 1.103.897 2 2 2h9c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2z",
        },
        child: [],
      },
    ],
  })(e);
}
function Ud(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: { d: "M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" },
        child: [],
      },
    ],
  })(e);
}
function sa(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z",
        },
        child: [],
      },
    ],
  })(e);
}
function zd(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M20 2H8c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM8 16V4h12l.002 12H8z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M4 8H2v12c0 1.103.897 2 2 2h12v-2H4V8zm8.933 3.519-1.726-1.726-1.414 1.414 3.274 3.274 5.702-6.84-1.538-1.282z",
        },
        child: [],
      },
    ],
  })(e);
}
function wp(e) {
  return U({
    attr: { viewBox: "0 0 24 24" },
    child: [
      {
        tag: "path",
        attr: {
          d: "m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z",
        },
        child: [],
      },
    ],
  })(e);
}
const $d = ({ hasDivider: e }) => {
    const { page: t } = Ec(),
      n = Re(),
      [r, s] = y.useState("d-none"),
      [a, o] = y.useState(location.href),
      [c, l] = y.useState(t),
      { apps: u, vw: d, handleIconClick: h } = _e();
    return (
      y.useEffect(() => {
        location.href !== a && o(location.href);
      }, [location.href == a]),
      y.useEffect(() => {
        if (c) s("d-block");
        else {
          if (c == null) return;
          s("slideOut"),
            setTimeout(() => {
              s("d-none");
            }, 500);
        }
      }, [c]),
      i.jsxs(i.Fragment, {
        children: [
          i.jsx("div", {
            className: "menu-panel",
            children: i.jsxs("div", {
              className: "mx-auto col-12 col-sm-10 col-md-8 col-xl-9",
              children: [
                c &&
                  i.jsx("div", {
                    onClick: () => l(!1),
                    className: "",
                    style: {
                      position: "fixed",
                      left: "0",
                      right: "0",
                      top: "0",
                      bottom: "0",
                    },
                  }),
                i.jsx("div", {
                  className: `inner rounded shadow-lg p-3 text-light bg-dark text-left slideUp ${r}`,
                  style: { zIndex: 5 },
                  children: i.jsxs("div", {
                    className: "row ani",
                    style: {
                      minHeight: "400px !important",
                      height: "60vh",
                      maxHeight: "800vh",
                    },
                    children: [
                      t !== "apps" &&
                        i.jsxs("div", {
                          className: `col-md-7 scrollbs ani ${
                            t == "apps" && "d-none"
                          }`,
                          style: { height: "100%", overflowY: "auto" },
                          children: [
                            i.jsxs("div", {
                              className: "d-flex ",
                              children: [
                                i.jsx("div", {
                                  className: "",
                                  children: i.jsx(Ne.LazyLoadImage, {
                                    effect: "opacity",
                                    src: "/sprintetName.png",
                                    placeholder: i.jsx(Ee, {}),
                                    className: "menuimg",
                                    alt: "Sprintet S logo",
                                    height: "100px",
                                    onClick: () => n("/"),
                                  }),
                                }),
                                d < 768 &&
                                  t !== "apps" &&
                                  i.jsx("div", {
                                    className: "my-auto ms-auto",
                                    children: i.jsx("div", {
                                      className: "p-2 active ",
                                      style: { borderRadius: "3px" },
                                      onClick: () => {
                                        n("/os/apps"), o("");
                                      },
                                      children:
                                        t == "apps"
                                          ? i.jsxs("span", {
                                              className: "slideLeft aniFast",
                                              children: [
                                                i.jsx(na, {
                                                  className: "fs-5 icon",
                                                }),
                                                "Menu",
                                              ],
                                            })
                                          : i.jsxs("div", {
                                              className: "slideRight aniFast",
                                              children: [
                                                "All Apps",
                                                i.jsx(ra, {
                                                  className: "fs-5 icon",
                                                }),
                                              ],
                                            }),
                                    }),
                                  }),
                              ],
                            }),
                            i.jsxs("div", {
                              className: "d-flex flex-column h-auto",
                              children: [
                                "Sprintet is a dynamic programming startup dedicated to delivering cutting-edge software solutions that drive business growth. We specialize in agile development methodologies, ensuring efficient project execution, high-quality results, and continuous improvement.",
                                i.jsx("div", {
                                  className: "mt-3",
                                  children: i.jsx(xe, {
                                    to: "/os?a=/about",
                                    title: "Learn more",
                                    "aria-label":
                                      "About Us - Learn more about Sprintet",
                                    onClick: () => {
                                      h("/about"), l(!1);
                                    },
                                    className: "p-2 active d-inline btn",
                                    style: { borderRadius: "3px" },
                                    children: "Learn More",
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                      i.jsx("div", {
                        className: `${
                          t == "apps" ? "col-12" : "col-md-5 ps-0"
                        } scrollbs ${d < 768 && t !== "apps" && "d-none"}`,
                        style: {
                          height: "90%",
                          maxHeight: "100%",
                          overflowY: "auto",
                        },
                        children: i.jsxs("div", {
                          id: "pinned",
                          className: `${t !== "apps" && "ps-3"} w-100`,
                          style: {
                            borderLeft: t !== "apps" && "1px solid #efefef40",
                            minHeight: "95%",
                          },
                          children: [
                            i.jsx("div", {
                              className: "my-2",
                              children: i.jsx("div", {
                                className: "p-2 active d-inline",
                                style: { borderRadius: "3px" },
                                onClick: () => {
                                  n(t == "apps" ? "/os" : "/os/apps"), o("");
                                },
                                children:
                                  t == "apps"
                                    ? i.jsxs("span", {
                                        className: "slideLeft aniFast",
                                        children: [
                                          i.jsx(na, { className: "fs-5 icon" }),
                                          "Menu",
                                        ],
                                      })
                                    : i.jsxs("span", {
                                        className: "slideRight aniFast",
                                        children: [
                                          "All Apps",
                                          i.jsx(ra, { className: "fs-5 icon" }),
                                        ],
                                      }),
                              }),
                            }),
                            i.jsx("div", {
                              className: "mt-3",
                              children: u.map((p) =>
                                i.jsx(
                                  Pi,
                                  { app: p, handleClick: () => l(!1) },
                                  p == null ? void 0 : p.location
                                )
                              ),
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
          i.jsx("div", {
            id: "start",
            title: "Sprintet Menu",
            className: `app my-auto p-1 btn fs-5 ${c && "active"}`,
            onClick: () => l((p) => !p),
            children: i.jsx(Ne.LazyLoadImage, {
              effect: "opacity",
              src: "/sprintetS.png",
              placeholder: i.jsx(Ee, {}),
              height: 40,
              alt: "Sprintet Logo",
              about: "Sprintet Logo Image",
              style: {},
            }),
          }),
          e !== !1 &&
            i.jsx("div", {
              className: "divider my-auto mx-2",
              style: { width: "1px", background: "#efefef60", height: "80%" },
            }),
        ],
      })
    );
  },
  Wd = (e, t, n, r) => {
    if (
      n === "length" ||
      n === "prototype" ||
      n === "arguments" ||
      n === "caller"
    )
      return;
    const s = Object.getOwnPropertyDescriptor(e, n),
      a = Object.getOwnPropertyDescriptor(t, n);
    (!Vd(s, a) && r) || Object.defineProperty(e, n, a);
  },
  Vd = function (e, t) {
    return (
      e === void 0 ||
      e.configurable ||
      (e.writable === t.writable &&
        e.enumerable === t.enumerable &&
        e.configurable === t.configurable &&
        (e.writable || e.value === t.value))
    );
  },
  qd = (e, t) => {
    const n = Object.getPrototypeOf(t);
    n !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, n);
  },
  Yd = (e, t) => `/* Wrapped ${e}*/
${t}`,
  Xd = Object.getOwnPropertyDescriptor(Function.prototype, "toString"),
  Jd = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"),
  Gd = (e, t, n) => {
    const r = n === "" ? "" : `with ${n.trim()}() `,
      s = Yd.bind(null, r, t.toString());
    Object.defineProperty(s, "name", Jd),
      Object.defineProperty(e, "toString", { ...Xd, value: s });
  },
  Kd = (e, t, { ignoreNonConfigurable: n = !1 } = {}) => {
    const { name: r } = e;
    for (const s of Reflect.ownKeys(t)) Wd(e, t, s, n);
    return qd(e, t), Gd(e, t, r), e;
  };
var Qd = Kd,
  Cr = { exports: {} },
  Zd = () => {
    const e = {};
    return (
      (e.promise = new Promise((t, n) => {
        (e.resolve = t), (e.reject = n);
      })),
      e
    );
  };
(function (e, t) {
  var n =
      (Jt && Jt.__awaiter) ||
      function (o, c, l, u) {
        return new (l || (l = Promise))(function (d, h) {
          function p(g) {
            try {
              v(u.next(g));
            } catch (m) {
              h(m);
            }
          }
          function x(g) {
            try {
              v(u.throw(g));
            } catch (m) {
              h(m);
            }
          }
          function v(g) {
            g.done
              ? d(g.value)
              : new l(function (m) {
                  m(g.value);
                }).then(p, x);
          }
          v((u = u.apply(o, c || [])).next());
        });
      },
    r =
      (Jt && Jt.__importDefault) ||
      function (o) {
        return o && o.__esModule ? o : { default: o };
      };
  Object.defineProperty(t, "__esModule", { value: !0 });
  const s = r(Zd);
  function a(o, c = "maxAge") {
    let l, u, d;
    const h = () =>
        n(this, void 0, void 0, function* () {
          if (l !== void 0) return;
          const v = (g) =>
            n(this, void 0, void 0, function* () {
              d = s.default();
              const m = g[1][c] - Date.now();
              if (m <= 0) {
                o.delete(g[0]), d.resolve();
                return;
              }
              return (
                (l = g[0]),
                (u = setTimeout(() => {
                  o.delete(g[0]), d && d.resolve();
                }, m)),
                typeof u.unref == "function" && u.unref(),
                d.promise
              );
            });
          try {
            for (const g of o) yield v(g);
          } catch {}
          l = void 0;
        }),
      p = () => {
        (l = void 0),
          u !== void 0 && (clearTimeout(u), (u = void 0)),
          d !== void 0 && (d.reject(void 0), (d = void 0));
      },
      x = o.set.bind(o);
    return (
      (o.set = (v, g) => {
        o.has(v) && o.delete(v);
        const m = x(v, g);
        return l && l === v && p(), h(), m;
      }),
      h(),
      o
    );
  }
  (t.default = a), (e.exports = a), (e.exports.default = a);
})(Cr, Cr.exports);
var eh = Cr.exports;
const th = Qd,
  nh = eh,
  rr = new WeakMap(),
  Ii = new WeakMap(),
  vn = (e, { cacheKey: t, cache: n = new Map(), maxAge: r } = {}) => {
    typeof r == "number" && nh(n);
    const s = function (...a) {
      const o = t ? t(a) : a[0],
        c = n.get(o);
      if (c) return c.data;
      const l = e.apply(this, a);
      return (
        n.set(o, {
          data: l,
          maxAge: r ? Date.now() + r : Number.POSITIVE_INFINITY,
        }),
        l
      );
    };
    return th(s, e, { ignoreNonConfigurable: !0 }), Ii.set(s, n), s;
  };
vn.decorator =
  (e = {}) =>
  (t, n, r) => {
    const s = t[n];
    if (typeof s != "function")
      throw new TypeError("The decorated value must be a function");
    delete r.value,
      delete r.writable,
      (r.get = function () {
        if (!rr.has(this)) {
          const a = vn(s, e);
          return rr.set(this, a), a;
        }
        return rr.get(this);
      });
  };
vn.clear = (e) => {
  const t = Ii.get(e);
  if (!t) throw new TypeError("Can't clear a function that was not memoized!");
  if (typeof t.clear != "function")
    throw new TypeError("The cache Map can't be cleared!");
  t.clear();
};
var rh = vn;
const Mi = Bt(rh);
function sh(e) {
  return typeof e == "string";
}
function ah(e, t, n) {
  return n.indexOf(e) === t;
}
function ih(e) {
  return e.toLowerCase() === e;
}
function aa(e) {
  return e.indexOf(",") === -1 ? e : e.split(",");
}
function Or(e) {
  if (!e) return e;
  if (e === "C" || e === "posix" || e === "POSIX") return "en-US";
  if (e.indexOf(".") !== -1) {
    var t = e.split(".")[0],
      n = t === void 0 ? "" : t;
    return Or(n);
  }
  if (e.indexOf("@") !== -1) {
    var r = e.split("@")[0],
      n = r === void 0 ? "" : r;
    return Or(n);
  }
  if (e.indexOf("-") === -1 || !ih(e)) return e;
  var s = e.split("-"),
    a = s[0],
    o = s[1],
    c = o === void 0 ? "" : o;
  return "".concat(a, "-").concat(c.toUpperCase());
}
function oh(e) {
  var t = e === void 0 ? {} : e,
    n = t.useFallbackLocale,
    r = n === void 0 ? !0 : n,
    s = t.fallbackLocale,
    a = s === void 0 ? "en-US" : s,
    o = [];
  if (typeof navigator < "u") {
    for (
      var c = navigator.languages || [], l = [], u = 0, d = c;
      u < d.length;
      u++
    ) {
      var h = d[u];
      l = l.concat(aa(h));
    }
    var p = navigator.language,
      x = p && aa(p);
    o = o.concat(l, x);
  }
  return r && o.push(a), o.filter(sh).map(Or).filter(ah);
}
var ch = Mi(oh, { cacheKey: JSON.stringify });
function lh(e) {
  return ch(e)[0] || null;
}
var Bi = Mi(lh, { cacheKey: JSON.stringify });
function Ye(e, t, n) {
  return function (s, a) {
    a === void 0 && (a = n);
    var o = e(s) + a;
    return t(o);
  };
}
function zt(e) {
  return function (n) {
    return new Date(e(n).getTime() - 1);
  };
}
function $t(e, t) {
  return function (r) {
    return [e(r), t(r)];
  };
}
function V(e) {
  if (e instanceof Date) return e.getFullYear();
  if (typeof e == "number") return e;
  var t = parseInt(e, 10);
  if (typeof e == "string" && !isNaN(t)) return t;
  throw new Error("Failed to get year from date: ".concat(e, "."));
}
function Ke(e) {
  if (e instanceof Date) return e.getMonth();
  throw new Error("Failed to get month from date: ".concat(e, "."));
}
function Pn(e) {
  if (e instanceof Date) return e.getDate();
  throw new Error("Failed to get year from date: ".concat(e, "."));
}
function bt(e) {
  var t = V(e),
    n = t + ((-t + 1) % 100),
    r = new Date();
  return r.setFullYear(n, 0, 1), r.setHours(0, 0, 0, 0), r;
}
var uh = Ye(V, bt, -100),
  Fi = Ye(V, bt, 100),
  ss = zt(Fi),
  dh = Ye(V, ss, -100),
  Hi = $t(bt, ss);
function Qe(e) {
  var t = V(e),
    n = t + ((-t + 1) % 10),
    r = new Date();
  return r.setFullYear(n, 0, 1), r.setHours(0, 0, 0, 0), r;
}
var Ui = Ye(V, Qe, -10),
  as = Ye(V, Qe, 10),
  Dn = zt(as),
  zi = Ye(V, Dn, -10),
  $i = $t(Qe, Dn);
function wt(e) {
  var t = V(e),
    n = new Date();
  return n.setFullYear(t, 0, 1), n.setHours(0, 0, 0, 0), n;
}
var Wi = Ye(V, wt, -1),
  is = Ye(V, wt, 1),
  Ln = zt(is),
  Vi = Ye(V, Ln, -1),
  hh = $t(wt, Ln);
function os(e, t) {
  return function (r, s) {
    s === void 0 && (s = t);
    var a = V(r),
      o = Ke(r) + s,
      c = new Date();
    return c.setFullYear(a, o, 1), c.setHours(0, 0, 0, 0), e(c);
  };
}
function it(e) {
  var t = V(e),
    n = Ke(e),
    r = new Date();
  return r.setFullYear(t, n, 1), r.setHours(0, 0, 0, 0), r;
}
var qi = os(it, -1),
  cs = os(it, 1),
  Wt = zt(cs),
  Yi = os(Wt, -1),
  fh = $t(it, Wt);
function mh(e, t) {
  return function (r, s) {
    s === void 0 && (s = t);
    var a = V(r),
      o = Ke(r),
      c = Pn(r) + s,
      l = new Date();
    return l.setFullYear(a, o, c), l.setHours(0, 0, 0, 0), e(l);
  };
}
function Vt(e) {
  var t = V(e),
    n = Ke(e),
    r = Pn(e),
    s = new Date();
  return s.setFullYear(t, n, r), s.setHours(0, 0, 0, 0), s;
}
var ph = mh(Vt, 1),
  ls = zt(ph),
  gh = $t(Vt, ls);
function Xi(e) {
  return Pn(Wt(e));
}
var ce = {
    GREGORY: "gregory",
    HEBREW: "hebrew",
    ISLAMIC: "islamic",
    ISO_8601: "iso8601",
  },
  yh = {
    gregory: [
      "en-CA",
      "en-US",
      "es-AR",
      "es-BO",
      "es-CL",
      "es-CO",
      "es-CR",
      "es-DO",
      "es-EC",
      "es-GT",
      "es-HN",
      "es-MX",
      "es-NI",
      "es-PA",
      "es-PE",
      "es-PR",
      "es-SV",
      "es-VE",
      "pt-BR",
    ],
    hebrew: ["he", "he-IL"],
    islamic: [
      "ar",
      "ar-AE",
      "ar-BH",
      "ar-DZ",
      "ar-EG",
      "ar-IQ",
      "ar-JO",
      "ar-KW",
      "ar-LY",
      "ar-OM",
      "ar-QA",
      "ar-SA",
      "ar-SD",
      "ar-SY",
      "ar-YE",
      "dv",
      "dv-MV",
      "ps",
      "ps-AR",
    ],
  },
  us = [0, 1, 2, 3, 4, 5, 6],
  sr = new Map();
function vh(e) {
  return function (n, r) {
    var s = n || Bi();
    sr.has(s) || sr.set(s, new Map());
    var a = sr.get(s);
    return (
      a.has(e) || a.set(e, new Intl.DateTimeFormat(s || void 0, e).format),
      a.get(e)(r)
    );
  };
}
function xh(e) {
  var t = new Date(e);
  return new Date(t.setHours(12));
}
function ot(e) {
  return function (t, n) {
    return vh(e)(t, xh(n));
  };
}
var bh = { day: "numeric" },
  wh = { day: "numeric", month: "long", year: "numeric" },
  Nh = { month: "long" },
  Eh = { month: "long", year: "numeric" },
  Th = { weekday: "short" },
  Sh = { weekday: "long" },
  jh = { year: "numeric" },
  _h = ot(bh),
  Ch = ot(wh),
  Oh = ot(Nh),
  Ji = ot(Eh),
  Ah = ot(Th),
  kh = ot(Sh),
  In = ot(jh),
  Rh = us[0],
  Ph = us[5],
  ia = us[6];
function Lt(e, t) {
  t === void 0 && (t = ce.ISO_8601);
  var n = e.getDay();
  switch (t) {
    case ce.ISO_8601:
      return (n + 6) % 7;
    case ce.ISLAMIC:
      return (n + 1) % 7;
    case ce.HEBREW:
    case ce.GREGORY:
      return n;
    default:
      throw new Error("Unsupported calendar type.");
  }
}
function Dh(e) {
  var t = bt(e);
  return V(t);
}
function Lh(e) {
  var t = Qe(e);
  return V(t);
}
function Ar(e, t) {
  t === void 0 && (t = ce.ISO_8601);
  var n = V(e),
    r = Ke(e),
    s = e.getDate() - Lt(e, t);
  return new Date(n, r, s);
}
function Ih(e, t) {
  t === void 0 && (t = ce.ISO_8601);
  var n = t === ce.GREGORY ? ce.GREGORY : ce.ISO_8601,
    r = Ar(e, t),
    s = V(e) + 1,
    a,
    o;
  do (a = new Date(s, 0, n === ce.ISO_8601 ? 4 : 1)), (o = Ar(a, t)), (s -= 1);
  while (e < o);
  return Math.round((r.getTime() - o.getTime()) / (864e5 * 7)) + 1;
}
function nt(e, t) {
  switch (e) {
    case "century":
      return bt(t);
    case "decade":
      return Qe(t);
    case "year":
      return wt(t);
    case "month":
      return it(t);
    case "day":
      return Vt(t);
    default:
      throw new Error("Invalid rangeType: ".concat(e));
  }
}
function Mh(e, t) {
  switch (e) {
    case "century":
      return uh(t);
    case "decade":
      return Ui(t);
    case "year":
      return Wi(t);
    case "month":
      return qi(t);
    default:
      throw new Error("Invalid rangeType: ".concat(e));
  }
}
function Gi(e, t) {
  switch (e) {
    case "century":
      return Fi(t);
    case "decade":
      return as(t);
    case "year":
      return is(t);
    case "month":
      return cs(t);
    default:
      throw new Error("Invalid rangeType: ".concat(e));
  }
}
function Bh(e, t) {
  switch (e) {
    case "decade":
      return Ui(t, -100);
    case "year":
      return Wi(t, -10);
    case "month":
      return qi(t, -12);
    default:
      throw new Error("Invalid rangeType: ".concat(e));
  }
}
function Fh(e, t) {
  switch (e) {
    case "decade":
      return as(t, 100);
    case "year":
      return is(t, 10);
    case "month":
      return cs(t, 12);
    default:
      throw new Error("Invalid rangeType: ".concat(e));
  }
}
function Ki(e, t) {
  switch (e) {
    case "century":
      return ss(t);
    case "decade":
      return Dn(t);
    case "year":
      return Ln(t);
    case "month":
      return Wt(t);
    case "day":
      return ls(t);
    default:
      throw new Error("Invalid rangeType: ".concat(e));
  }
}
function Hh(e, t) {
  switch (e) {
    case "century":
      return dh(t);
    case "decade":
      return zi(t);
    case "year":
      return Vi(t);
    case "month":
      return Yi(t);
    default:
      throw new Error("Invalid rangeType: ".concat(e));
  }
}
function Uh(e, t) {
  switch (e) {
    case "decade":
      return zi(t, -100);
    case "year":
      return Vi(t, -10);
    case "month":
      return Yi(t, -12);
    default:
      throw new Error("Invalid rangeType: ".concat(e));
  }
}
function oa(e, t) {
  switch (e) {
    case "century":
      return Hi(t);
    case "decade":
      return $i(t);
    case "year":
      return hh(t);
    case "month":
      return fh(t);
    case "day":
      return gh(t);
    default:
      throw new Error("Invalid rangeType: ".concat(e));
  }
}
function zh(e, t, n) {
  var r = [t, n].sort(function (s, a) {
    return s.getTime() - a.getTime();
  });
  return [nt(e, r[0]), Ki(e, r[1])];
}
function Qi(e, t, n) {
  return n
    .map(function (r) {
      return (t || In)(e, r);
    })
    .join(" – ");
}
function $h(e, t, n) {
  return Qi(e, t, Hi(n));
}
function Zi(e, t, n) {
  return Qi(e, t, $i(n));
}
function Wh(e) {
  return e.getDay() === new Date().getDay();
}
function eo(e, t) {
  t === void 0 && (t = ce.ISO_8601);
  var n = e.getDay();
  switch (t) {
    case ce.ISLAMIC:
    case ce.HEBREW:
      return n === Ph || n === ia;
    case ce.ISO_8601:
    case ce.GREGORY:
      return n === ia || n === Rh;
    default:
      throw new Error("Unsupported calendar type.");
  }
}
var ze = "react-calendar__navigation";
function Vh(e) {
  var t = e.activeStartDate,
    n = e.drillUp,
    r = e.formatMonthYear,
    s = r === void 0 ? Ji : r,
    a = e.formatYear,
    o = a === void 0 ? In : a,
    c = e.locale,
    l = e.maxDate,
    u = e.minDate,
    d = e.navigationAriaLabel,
    h = d === void 0 ? "" : d,
    p = e.navigationAriaLive,
    x = e.navigationLabel,
    v = e.next2AriaLabel,
    g = v === void 0 ? "" : v,
    m = e.next2Label,
    w = m === void 0 ? "»" : m,
    T = e.nextAriaLabel,
    N = T === void 0 ? "" : T,
    _ = e.nextLabel,
    O = _ === void 0 ? "›" : _,
    j = e.prev2AriaLabel,
    f = j === void 0 ? "" : j,
    E = e.prev2Label,
    S = E === void 0 ? "«" : E,
    L = e.prevAriaLabel,
    k = L === void 0 ? "" : L,
    A = e.prevLabel,
    Te = A === void 0 ? "‹" : A,
    te = e.setActiveStartDate,
    Ce = e.showDoubleView,
    G = e.view,
    de = e.views,
    he = de.indexOf(G) > 0,
    ae = G !== "century",
    z = Mh(G, t),
    re = ae ? Bh(G, t) : void 0,
    Y = Gi(G, t),
    K = ae ? Fh(G, t) : void 0,
    ne = (function () {
      if (z.getFullYear() < 0) return !0;
      var C = Hh(G, t);
      return u && u >= C;
    })(),
    ie =
      ae &&
      (function () {
        if (re.getFullYear() < 0) return !0;
        var C = Uh(G, t);
        return u && u >= C;
      })(),
    me = l && l < Y,
    se = ae && l && l < K;
  function Pe() {
    te(z, "prev");
  }
  function Fe() {
    te(re, "prev2");
  }
  function ct() {
    te(Y, "next");
  }
  function Nt() {
    te(K, "next2");
  }
  function lt(C) {
    var R = (function () {
      switch (G) {
        case "century":
          return $h(c, o, C);
        case "decade":
          return Zi(c, o, C);
        case "year":
          return o(c, C);
        case "month":
          return s(c, C);
        default:
          throw new Error("Invalid view: ".concat(G, "."));
      }
    })();
    return x
      ? x({ date: C, label: R, locale: c || Bi() || void 0, view: G })
      : R;
  }
  function ut() {
    var C = "".concat(ze, "__label");
    return i.jsxs("button", {
      "aria-label": h,
      "aria-live": p,
      className: C,
      disabled: !he,
      onClick: n,
      style: { flexGrow: 1 },
      type: "button",
      children: [
        i.jsx("span", {
          className: ""
            .concat(C, "__labelText ")
            .concat(C, "__labelText--from"),
          children: lt(t),
        }),
        Ce
          ? i.jsxs(i.Fragment, {
              children: [
                i.jsx("span", {
                  className: "".concat(C, "__divider"),
                  children: " – ",
                }),
                i.jsx("span", {
                  className: ""
                    .concat(C, "__labelText ")
                    .concat(C, "__labelText--to"),
                  children: lt(Y),
                }),
              ],
            })
          : null,
      ],
    });
  }
  return i.jsxs("div", {
    className: ze,
    children: [
      S !== null && ae
        ? i.jsx("button", {
            "aria-label": f,
            className: "".concat(ze, "__arrow ").concat(ze, "__prev2-button"),
            disabled: ie,
            onClick: Fe,
            type: "button",
            children: S,
          })
        : null,
      Te !== null &&
        i.jsx("button", {
          "aria-label": k,
          className: "".concat(ze, "__arrow ").concat(ze, "__prev-button"),
          disabled: ne,
          onClick: Pe,
          type: "button",
          children: Te,
        }),
      ut(),
      O !== null &&
        i.jsx("button", {
          "aria-label": N,
          className: "".concat(ze, "__arrow ").concat(ze, "__next-button"),
          disabled: me,
          onClick: ct,
          type: "button",
          children: O,
        }),
      w !== null && ae
        ? i.jsx("button", {
            "aria-label": g,
            className: "".concat(ze, "__arrow ").concat(ze, "__next2-button"),
            disabled: se,
            onClick: Nt,
            type: "button",
            children: w,
          })
        : null,
    ],
  });
}
var ht = function () {
    return (
      (ht =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      ht.apply(this, arguments)
    );
  },
  qh = function (e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
      for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++)
        t.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
          (n[r[s]] = e[r[s]]);
    return n;
  };
function ca(e) {
  return "".concat(e, "%");
}
function ds(e) {
  var t = e.children,
    n = e.className,
    r = e.count,
    s = e.direction,
    a = e.offset,
    o = e.style,
    c = e.wrap,
    l = qh(e, [
      "children",
      "className",
      "count",
      "direction",
      "offset",
      "style",
      "wrap",
    ]);
  return i.jsx(
    "div",
    ht(
      {
        className: n,
        style: ht(
          {
            display: "flex",
            flexDirection: s,
            flexWrap: c ? "wrap" : "nowrap",
          },
          o
        ),
      },
      l,
      {
        children: y.Children.map(t, function (u, d) {
          var h = a && d === 0 ? ca((100 * a) / r) : null;
          return y.cloneElement(
            u,
            ht(ht({}, u.props), {
              style: {
                flexBasis: ca(100 / r),
                flexShrink: 0,
                flexGrow: 0,
                overflow: "hidden",
                marginLeft: h,
                marginInlineStart: h,
                marginInlineEnd: 0,
              },
            })
          );
        }),
      }
    )
  );
}
function Yh(e, t, n) {
  return t && t > e ? t : n && n < e ? n : e;
}
function It(e, t) {
  return t[0] <= e && t[1] >= e;
}
function Xh(e, t) {
  return e[0] <= t[0] && e[1] >= t[1];
}
function to(e, t) {
  return It(e[0], t) || It(e[1], t);
}
function la(e, t, n) {
  var r = to(t, e),
    s = [];
  if (r) {
    s.push(n);
    var a = It(e[0], t),
      o = It(e[1], t);
    a && s.push("".concat(n, "Start")),
      o && s.push("".concat(n, "End")),
      a && o && s.push("".concat(n, "BothEnds"));
  }
  return s;
}
function Jh(e) {
  return Array.isArray(e) ? e[0] !== null && e[1] !== null : e !== null;
}
function Gh(e) {
  if (!e) throw new Error("args is required");
  var t = e.value,
    n = e.date,
    r = e.hover,
    s = "react-calendar__tile",
    a = [s];
  if (!n) return a;
  var o = new Date(),
    c = (function () {
      if (Array.isArray(n)) return n;
      var x = e.dateType;
      if (!x)
        throw new Error(
          "dateType is required when date is not an array of two dates"
        );
      return oa(x, n);
    })();
  if ((It(o, c) && a.push("".concat(s, "--now")), !t || !Jh(t))) return a;
  var l = (function () {
    if (Array.isArray(t)) return t;
    var x = e.valueType;
    if (!x)
      throw new Error(
        "valueType is required when value is not an array of two dates"
      );
    return oa(x, t);
  })();
  Xh(l, c)
    ? a.push("".concat(s, "--active"))
    : to(l, c) && a.push("".concat(s, "--hasActive"));
  var u = la(l, c, "".concat(s, "--range"));
  a.push.apply(a, u);
  var d = Array.isArray(t) ? t : [t];
  if (r && d.length === 1) {
    var h = r > l[0] ? [l[0], r] : [r, l[0]],
      p = la(h, c, "".concat(s, "--hover"));
    a.push.apply(a, p);
  }
  return a;
}
function Mn(e) {
  for (
    var t = e.className,
      n = e.count,
      r = n === void 0 ? 3 : n,
      s = e.dateTransform,
      a = e.dateType,
      o = e.end,
      c = e.hover,
      l = e.offset,
      u = e.renderTile,
      d = e.start,
      h = e.step,
      p = h === void 0 ? 1 : h,
      x = e.value,
      v = e.valueType,
      g = [],
      m = d;
    m <= o;
    m += p
  ) {
    var w = s(m);
    g.push(
      u({
        classes: Gh({ date: w, dateType: a, hover: c, value: x, valueType: v }),
        date: w,
      })
    );
  }
  return i.jsx(ds, {
    className: t,
    count: r,
    offset: l,
    wrap: !0,
    children: g,
  });
}
function Bn(e) {
  var t = e.activeStartDate,
    n = e.children,
    r = e.classes,
    s = e.date,
    a = e.formatAbbr,
    o = e.locale,
    c = e.maxDate,
    l = e.maxDateTransform,
    u = e.minDate,
    d = e.minDateTransform,
    h = e.onClick,
    p = e.onMouseOver,
    x = e.style,
    v = e.tileClassName,
    g = e.tileContent,
    m = e.tileDisabled,
    w = e.view,
    T = y.useMemo(
      function () {
        var _ = { activeStartDate: t, date: s, view: w };
        return typeof v == "function" ? v(_) : v;
      },
      [t, s, v, w]
    ),
    N = y.useMemo(
      function () {
        var _ = { activeStartDate: t, date: s, view: w };
        return typeof g == "function" ? g(_) : g;
      },
      [t, s, g, w]
    );
  return i.jsxs("button", {
    className: ke(r, T),
    disabled:
      (u && d(u) > s) ||
      (c && l(c) < s) ||
      (m == null ? void 0 : m({ activeStartDate: t, date: s, view: w })),
    onClick: h
      ? function (_) {
          return h(s, _);
        }
      : void 0,
    onFocus: p
      ? function () {
          return p(s);
        }
      : void 0,
    onMouseOver: p
      ? function () {
          return p(s);
        }
      : void 0,
    style: x,
    type: "button",
    children: [
      a ? i.jsx("abbr", { "aria-label": a(o, s), children: n }) : n,
      N,
    ],
  });
}
var kr = function () {
    return (
      (kr =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      kr.apply(this, arguments)
    );
  },
  Kh = function (e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
      for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++)
        t.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
          (n[r[s]] = e[r[s]]);
    return n;
  },
  ua = "react-calendar__century-view__decades__decade";
function Qh(e) {
  var t = e.classes,
    n = t === void 0 ? [] : t,
    r = e.currentCentury,
    s = e.formatYear,
    a = s === void 0 ? In : s,
    o = Kh(e, ["classes", "currentCentury", "formatYear"]),
    c = o.date,
    l = o.locale,
    u = [];
  return (
    n && u.push.apply(u, n),
    u.push(ua),
    bt(c).getFullYear() !== r && u.push("".concat(ua, "--neighboringCentury")),
    i.jsx(
      Bn,
      kr({}, o, {
        classes: u,
        maxDateTransform: Dn,
        minDateTransform: Qe,
        view: "century",
        children: Zi(l, a, c),
      })
    )
  );
}
var Rr = function () {
    return (
      (Rr =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      Rr.apply(this, arguments)
    );
  },
  da = function (e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
      for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++)
        t.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
          (n[r[s]] = e[r[s]]);
    return n;
  };
function Zh(e) {
  var t = e.activeStartDate,
    n = e.hover,
    r = e.showNeighboringCentury,
    s = e.value,
    a = e.valueType,
    o = da(e, [
      "activeStartDate",
      "hover",
      "showNeighboringCentury",
      "value",
      "valueType",
    ]),
    c = Dh(t),
    l = c + (r ? 119 : 99);
  return i.jsx(Mn, {
    className: "react-calendar__century-view__decades",
    dateTransform: Qe,
    dateType: "decade",
    end: l,
    hover: n,
    renderTile: function (u) {
      var d = u.date,
        h = da(u, ["date"]);
      return i.jsx(
        Qh,
        Rr({}, o, h, { activeStartDate: t, currentCentury: c, date: d }),
        d.getTime()
      );
    },
    start: c,
    step: 10,
    value: s,
    valueType: a,
  });
}
var Pr = function () {
  return (
    (Pr =
      Object.assign ||
      function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) {
          t = arguments[n];
          for (var s in t)
            Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
        }
        return e;
      }),
    Pr.apply(this, arguments)
  );
};
function ef(e) {
  function t() {
    return i.jsx(Zh, Pr({}, e));
  }
  return i.jsx("div", {
    className: "react-calendar__century-view",
    children: t(),
  });
}
var Dr = function () {
    return (
      (Dr =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      Dr.apply(this, arguments)
    );
  },
  tf = function (e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
      for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++)
        t.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
          (n[r[s]] = e[r[s]]);
    return n;
  },
  ha = "react-calendar__decade-view__years__year";
function nf(e) {
  var t = e.classes,
    n = t === void 0 ? [] : t,
    r = e.currentDecade,
    s = e.formatYear,
    a = s === void 0 ? In : s,
    o = tf(e, ["classes", "currentDecade", "formatYear"]),
    c = o.date,
    l = o.locale,
    u = [];
  return (
    n && u.push.apply(u, n),
    u.push(ha),
    Qe(c).getFullYear() !== r && u.push("".concat(ha, "--neighboringDecade")),
    i.jsx(
      Bn,
      Dr({}, o, {
        classes: u,
        maxDateTransform: Ln,
        minDateTransform: wt,
        view: "decade",
        children: a(l, c),
      })
    )
  );
}
var Lr = function () {
    return (
      (Lr =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      Lr.apply(this, arguments)
    );
  },
  fa = function (e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
      for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++)
        t.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
          (n[r[s]] = e[r[s]]);
    return n;
  };
function rf(e) {
  var t = e.activeStartDate,
    n = e.hover,
    r = e.showNeighboringDecade,
    s = e.value,
    a = e.valueType,
    o = fa(e, [
      "activeStartDate",
      "hover",
      "showNeighboringDecade",
      "value",
      "valueType",
    ]),
    c = Lh(t),
    l = c + (r ? 11 : 9);
  return i.jsx(Mn, {
    className: "react-calendar__decade-view__years",
    dateTransform: wt,
    dateType: "year",
    end: l,
    hover: n,
    renderTile: function (u) {
      var d = u.date,
        h = fa(u, ["date"]);
      return i.jsx(
        nf,
        Lr({}, o, h, { activeStartDate: t, currentDecade: c, date: d }),
        d.getTime()
      );
    },
    start: c,
    value: s,
    valueType: a,
  });
}
var Ir = function () {
  return (
    (Ir =
      Object.assign ||
      function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) {
          t = arguments[n];
          for (var s in t)
            Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
        }
        return e;
      }),
    Ir.apply(this, arguments)
  );
};
function sf(e) {
  function t() {
    return i.jsx(rf, Ir({}, e));
  }
  return i.jsx("div", {
    className: "react-calendar__decade-view",
    children: t(),
  });
}
var Mr = function () {
    return (
      (Mr =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      Mr.apply(this, arguments)
    );
  },
  af = function (e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
      for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++)
        t.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
          (n[r[s]] = e[r[s]]);
    return n;
  },
  ma = function (e, t, n) {
    if (n || arguments.length === 2)
      for (var r = 0, s = t.length, a; r < s; r++)
        (a || !(r in t)) &&
          (a || (a = Array.prototype.slice.call(t, 0, r)), (a[r] = t[r]));
    return e.concat(a || Array.prototype.slice.call(t));
  },
  of = "react-calendar__year-view__months__month";
function cf(e) {
  var t = e.classes,
    n = t === void 0 ? [] : t,
    r = e.formatMonth,
    s = r === void 0 ? Oh : r,
    a = e.formatMonthYear,
    o = a === void 0 ? Ji : a,
    c = af(e, ["classes", "formatMonth", "formatMonthYear"]),
    l = c.date,
    u = c.locale;
  return i.jsx(
    Bn,
    Mr({}, c, {
      classes: ma(ma([], n, !0), [of], !1),
      formatAbbr: o,
      maxDateTransform: Wt,
      minDateTransform: it,
      view: "year",
      children: s(u, l),
    })
  );
}
var Br = function () {
    return (
      (Br =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      Br.apply(this, arguments)
    );
  },
  pa = function (e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
      for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++)
        t.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
          (n[r[s]] = e[r[s]]);
    return n;
  };
function lf(e) {
  var t = e.activeStartDate,
    n = e.hover,
    r = e.value,
    s = e.valueType,
    a = pa(e, ["activeStartDate", "hover", "value", "valueType"]),
    o = 0,
    c = 11,
    l = V(t);
  return i.jsx(Mn, {
    className: "react-calendar__year-view__months",
    dateTransform: function (u) {
      var d = new Date();
      return d.setFullYear(l, u, 1), it(d);
    },
    dateType: "month",
    end: c,
    hover: n,
    renderTile: function (u) {
      var d = u.date,
        h = pa(u, ["date"]);
      return i.jsx(
        cf,
        Br({}, a, h, { activeStartDate: t, date: d }),
        d.getTime()
      );
    },
    start: o,
    value: r,
    valueType: s,
  });
}
var Fr = function () {
  return (
    (Fr =
      Object.assign ||
      function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++) {
          t = arguments[n];
          for (var s in t)
            Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
        }
        return e;
      }),
    Fr.apply(this, arguments)
  );
};
function uf(e) {
  function t() {
    return i.jsx(lf, Fr({}, e));
  }
  return i.jsx("div", {
    className: "react-calendar__year-view",
    children: t(),
  });
}
var Hr = function () {
    return (
      (Hr =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      Hr.apply(this, arguments)
    );
  },
  df = function (e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
      for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++)
        t.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
          (n[r[s]] = e[r[s]]);
    return n;
  },
  ar = "react-calendar__month-view__days__day";
function hf(e) {
  var t = e.calendarType,
    n = e.classes,
    r = n === void 0 ? [] : n,
    s = e.currentMonthIndex,
    a = e.formatDay,
    o = a === void 0 ? _h : a,
    c = e.formatLongDate,
    l = c === void 0 ? Ch : c,
    u = df(e, [
      "calendarType",
      "classes",
      "currentMonthIndex",
      "formatDay",
      "formatLongDate",
    ]),
    d = u.date,
    h = u.locale,
    p = [];
  return (
    r && p.push.apply(p, r),
    p.push(ar),
    eo(d, t) && p.push("".concat(ar, "--weekend")),
    d.getMonth() !== s && p.push("".concat(ar, "--neighboringMonth")),
    i.jsx(
      Bn,
      Hr({}, u, {
        classes: p,
        formatAbbr: l,
        maxDateTransform: ls,
        minDateTransform: Vt,
        view: "month",
        children: o(h, d),
      })
    )
  );
}
var Ur = function () {
    return (
      (Ur =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      Ur.apply(this, arguments)
    );
  },
  ga = function (e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
      for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++)
        t.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
          (n[r[s]] = e[r[s]]);
    return n;
  };
function ff(e) {
  var t = e.activeStartDate,
    n = e.calendarType,
    r = e.hover,
    s = e.showFixedNumberOfWeeks,
    a = e.showNeighboringMonth,
    o = e.value,
    c = e.valueType,
    l = ga(e, [
      "activeStartDate",
      "calendarType",
      "hover",
      "showFixedNumberOfWeeks",
      "showNeighboringMonth",
      "value",
      "valueType",
    ]),
    u = V(t),
    d = Ke(t),
    h = s || a,
    p = Lt(t, n),
    x = h ? 0 : p,
    v = (h ? -p : 0) + 1,
    g = (function () {
      if (s) return v + 6 * 7 - 1;
      var m = Xi(t);
      if (a) {
        var w = new Date();
        w.setFullYear(u, d, m), w.setHours(0, 0, 0, 0);
        var T = 7 - Lt(w, n) - 1;
        return m + T;
      }
      return m;
    })();
  return i.jsx(Mn, {
    className: "react-calendar__month-view__days",
    count: 7,
    dateTransform: function (m) {
      var w = new Date();
      return w.setFullYear(u, d, m), Vt(w);
    },
    dateType: "day",
    hover: r,
    end: g,
    renderTile: function (m) {
      var w = m.date,
        T = ga(m, ["date"]);
      return i.jsx(
        hf,
        Ur({}, l, T, {
          activeStartDate: t,
          calendarType: n,
          currentMonthIndex: d,
          date: w,
        }),
        w.getTime()
      );
    },
    offset: x,
    start: v,
    value: o,
    valueType: c,
  });
}
var no = "react-calendar__month-view__weekdays",
  ir = "".concat(no, "__weekday");
function mf(e) {
  for (
    var t = e.calendarType,
      n = e.formatShortWeekday,
      r = n === void 0 ? Ah : n,
      s = e.formatWeekday,
      a = s === void 0 ? kh : s,
      o = e.locale,
      c = e.onMouseLeave,
      l = new Date(),
      u = it(l),
      d = V(u),
      h = Ke(u),
      p = [],
      x = 1;
    x <= 7;
    x += 1
  ) {
    var v = new Date(d, h, x - Lt(u, t)),
      g = a(o, v);
    p.push(
      i.jsx(
        "div",
        {
          className: ke(
            ir,
            Wh(v) && "".concat(ir, "--current"),
            eo(v, t) && "".concat(ir, "--weekend")
          ),
          children: i.jsx("abbr", {
            "aria-label": g,
            title: g,
            children: r(o, v).replace(".", ""),
          }),
        },
        x
      )
    );
  }
  return i.jsx(ds, {
    className: no,
    count: 7,
    onFocus: c,
    onMouseOver: c,
    children: p,
  });
}
var xn = function () {
    return (
      (xn =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      xn.apply(this, arguments)
    );
  },
  ya = function (e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
      for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++)
        t.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
          (n[r[s]] = e[r[s]]);
    return n;
  },
  va = "react-calendar__tile";
function pf(e) {
  var t = e.onClickWeekNumber,
    n = e.weekNumber,
    r = i.jsx("span", { children: n });
  if (t) {
    var s = e.date,
      a = e.onClickWeekNumber,
      o = e.weekNumber,
      c = ya(e, ["date", "onClickWeekNumber", "weekNumber"]);
    return i.jsx(
      "button",
      xn({}, c, {
        className: va,
        onClick: function (l) {
          return a(o, s, l);
        },
        type: "button",
        children: r,
      })
    );
  } else {
    e.date, e.onClickWeekNumber, e.weekNumber;
    var c = ya(e, ["date", "onClickWeekNumber", "weekNumber"]);
    return i.jsx("div", xn({}, c, { className: va, children: r }));
  }
}
function gf(e) {
  var t = e.activeStartDate,
    n = e.calendarType,
    r = e.onClickWeekNumber,
    s = e.onMouseLeave,
    a = e.showFixedNumberOfWeeks,
    o = (function () {
      if (a) return 6;
      var u = Xi(t),
        d = Lt(t, n),
        h = u - (7 - d);
      return 1 + Math.ceil(h / 7);
    })(),
    c = (function () {
      for (var u = V(t), d = Ke(t), h = Pn(t), p = [], x = 0; x < o; x += 1)
        p.push(Ar(new Date(u, d, h + x * 7), n));
      return p;
    })(),
    l = c.map(function (u) {
      return Ih(u, n);
    });
  return i.jsx(ds, {
    className: "react-calendar__month-view__weekNumbers",
    count: o,
    direction: "column",
    onFocus: s,
    onMouseOver: s,
    style: { flexBasis: "calc(100% * (1 / 8)", flexShrink: 0 },
    children: l.map(function (u, d) {
      var h = c[d];
      if (!h) throw new Error("date is not defined");
      return i.jsx(pf, { date: h, onClickWeekNumber: r, weekNumber: u }, u);
    }),
  });
}
var zr = function () {
    return (
      (zr =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      zr.apply(this, arguments)
    );
  },
  yf = function (e, t) {
    var n = {};
    for (var r in e)
      Object.prototype.hasOwnProperty.call(e, r) &&
        t.indexOf(r) < 0 &&
        (n[r] = e[r]);
    if (e != null && typeof Object.getOwnPropertySymbols == "function")
      for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++)
        t.indexOf(r[s]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(e, r[s]) &&
          (n[r[s]] = e[r[s]]);
    return n;
  };
function vf(e) {
  if (e)
    for (var t = 0, n = Object.entries(yh); t < n.length; t++) {
      var r = n[t],
        s = r[0],
        a = r[1];
      if (a.includes(e)) return s;
    }
  return ce.ISO_8601;
}
function xf(e) {
  var t = e.activeStartDate,
    n = e.locale,
    r = e.onMouseLeave,
    s = e.showFixedNumberOfWeeks,
    a = e.calendarType,
    o = a === void 0 ? vf(n) : a,
    c = e.formatShortWeekday,
    l = e.formatWeekday,
    u = e.onClickWeekNumber,
    d = e.showWeekNumbers,
    h = yf(e, [
      "calendarType",
      "formatShortWeekday",
      "formatWeekday",
      "onClickWeekNumber",
      "showWeekNumbers",
    ]);
  function p() {
    return i.jsx(mf, {
      calendarType: o,
      formatShortWeekday: c,
      formatWeekday: l,
      locale: n,
      onMouseLeave: r,
    });
  }
  function x() {
    return d
      ? i.jsx(gf, {
          activeStartDate: t,
          calendarType: o,
          onClickWeekNumber: u,
          onMouseLeave: r,
          showFixedNumberOfWeeks: s,
        })
      : null;
  }
  function v() {
    return i.jsx(ff, zr({ calendarType: o }, h));
  }
  var g = "react-calendar__month-view";
  return i.jsx("div", {
    className: ke(g, d ? "".concat(g, "--weekNumbers") : ""),
    children: i.jsxs("div", {
      style: { display: "flex", alignItems: "flex-end" },
      children: [
        x(),
        i.jsxs("div", {
          style: { flexGrow: 1, width: "100%" },
          children: [p(), v()],
        }),
      ],
    }),
  });
}
var ft = function () {
    return (
      (ft =
        Object.assign ||
        function (e) {
          for (var t, n = 1, r = arguments.length; n < r; n++) {
            t = arguments[n];
            for (var s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
          }
          return e;
        }),
      ft.apply(this, arguments)
    );
  },
  en = "react-calendar",
  hn = ["century", "decade", "year", "month"],
  bf = ["decade", "year", "month", "day"],
  hs = new Date();
hs.setFullYear(1, 0, 1);
hs.setHours(0, 0, 0, 0);
var wf = new Date(864e13);
function Ct(e) {
  return e instanceof Date ? e : new Date(e);
}
function ro(e, t) {
  return hn.slice(hn.indexOf(e), hn.indexOf(t) + 1);
}
function Nf(e, t, n) {
  var r = ro(t, n);
  return r.indexOf(e) !== -1;
}
function fs(e, t, n) {
  return e && Nf(e, t, n) ? e : n;
}
function so(e) {
  var t = hn.indexOf(e);
  return bf[t];
}
function Ef(e, t) {
  var n = Array.isArray(e) ? e[t] : e;
  if (!n) return null;
  var r = Ct(n);
  if (Number.isNaN(r.getTime())) throw new Error("Invalid date: ".concat(e));
  return r;
}
function ao(e, t) {
  var n = e.value,
    r = e.minDate,
    s = e.maxDate,
    a = e.maxDetail,
    o = Ef(n, t);
  if (!o) return null;
  var c = so(a),
    l = (function () {
      switch (t) {
        case 0:
          return nt(c, o);
        case 1:
          return Ki(c, o);
        default:
          throw new Error("Invalid index value: ".concat(t));
      }
    })();
  return Yh(l, r, s);
}
var ms = function (e) {
    return ao(e, 0);
  },
  io = function (e) {
    return ao(e, 1);
  },
  Tf = function (e) {
    return [ms, io].map(function (t) {
      return t(e);
    });
  };
function oo(e) {
  var t = e.maxDate,
    n = e.maxDetail,
    r = e.minDate,
    s = e.minDetail,
    a = e.value,
    o = e.view,
    c = fs(o, s, n),
    l = ms({ value: a, minDate: r, maxDate: t, maxDetail: n }) || new Date();
  return nt(c, l);
}
function Sf(e) {
  var t = e.activeStartDate,
    n = e.defaultActiveStartDate,
    r = e.defaultValue,
    s = e.defaultView,
    a = e.maxDate,
    o = e.maxDetail,
    c = e.minDate,
    l = e.minDetail,
    u = e.value,
    d = e.view,
    h = fs(d, l, o),
    p = t || n;
  return p
    ? nt(h, p)
    : oo({
        maxDate: a,
        maxDetail: o,
        minDate: c,
        minDetail: l,
        value: u || r,
        view: d || s,
      });
}
function or(e) {
  return e && (!Array.isArray(e) || e.length === 1);
}
function tn(e, t) {
  return e instanceof Date && t instanceof Date && e.getTime() === t.getTime();
}
var jf = y.forwardRef(function (t, n) {
  var r = t.activeStartDate,
    s = t.allowPartialRange,
    a = t.calendarType,
    o = t.className,
    c = t.defaultActiveStartDate,
    l = t.defaultValue,
    u = t.defaultView,
    d = t.formatDay,
    h = t.formatLongDate,
    p = t.formatMonth,
    x = t.formatMonthYear,
    v = t.formatShortWeekday,
    g = t.formatWeekday,
    m = t.formatYear,
    w = t.goToRangeStartOnSelect,
    T = w === void 0 ? !0 : w,
    N = t.inputRef,
    _ = t.locale,
    O = t.maxDate,
    j = O === void 0 ? wf : O,
    f = t.maxDetail,
    E = f === void 0 ? "month" : f,
    S = t.minDate,
    L = S === void 0 ? hs : S,
    k = t.minDetail,
    A = k === void 0 ? "century" : k,
    Te = t.navigationAriaLabel,
    te = t.navigationAriaLive,
    Ce = t.navigationLabel,
    G = t.next2AriaLabel,
    de = t.next2Label,
    he = t.nextAriaLabel,
    ae = t.nextLabel,
    z = t.onActiveStartDateChange,
    re = t.onChange,
    Y = t.onClickDay,
    K = t.onClickDecade,
    ne = t.onClickMonth,
    ie = t.onClickWeekNumber,
    me = t.onClickYear,
    se = t.onDrillDown,
    Pe = t.onDrillUp,
    Fe = t.onViewChange,
    ct = t.prev2AriaLabel,
    Nt = t.prev2Label,
    lt = t.prevAriaLabel,
    ut = t.prevLabel,
    C = t.returnValue,
    R = C === void 0 ? "start" : C,
    M = t.selectRange,
    Se = t.showDoubleView,
    Oe = t.showFixedNumberOfWeeks,
    ps = t.showNavigation,
    No = ps === void 0 ? !0 : ps,
    Eo = t.showNeighboringCentury,
    To = t.showNeighboringDecade,
    gs = t.showNeighboringMonth,
    So = gs === void 0 ? !0 : gs,
    jo = t.showWeekNumbers,
    _o = t.tileClassName,
    Co = t.tileContent,
    Oo = t.tileDisabled,
    Hn = t.value,
    ys = t.view,
    vs = y.useState(c),
    Ao = vs[0],
    qt = vs[1],
    xs = y.useState(null),
    ko = xs[0],
    bs = xs[1],
    ws = y.useState(
      Array.isArray(l)
        ? l.map(function (B) {
            return B !== null ? Ct(B) : null;
          })
        : l != null
        ? Ct(l)
        : null
    ),
    Un = ws[0],
    Ro = ws[1],
    Ns = y.useState(u),
    Po = Ns[0],
    Es = Ns[1],
    pe =
      r ||
      Ao ||
      Sf({
        activeStartDate: r,
        defaultActiveStartDate: c,
        defaultValue: l,
        defaultView: u,
        maxDate: j,
        maxDetail: E,
        minDate: L,
        minDetail: A,
        value: Hn,
        view: ys,
      }),
    ge = (function () {
      var B = (function () {
        return M && or(Un) ? Un : Hn !== void 0 ? Hn : Un;
      })();
      return B
        ? Array.isArray(B)
          ? B.map(function (X) {
              return X !== null ? Ct(X) : null;
            })
          : B !== null
          ? Ct(B)
          : null
        : null;
    })(),
    Yt = so(E),
    q = fs(ys || Po, A, E),
    He = ro(A, E),
    Do = M ? ko : null,
    zn = He.indexOf(q) < He.length - 1,
    Ts = He.indexOf(q) > 0,
    Ss = y.useCallback(
      function (B) {
        var X = (function () {
          switch (R) {
            case "start":
              return ms;
            case "end":
              return io;
            case "range":
              return Tf;
            default:
              throw new Error("Invalid returnValue.");
          }
        })();
        return X({ maxDate: j, maxDetail: E, minDate: L, value: B });
      },
      [j, E, L, R]
    ),
    $n = y.useCallback(
      function (B, X) {
        qt(B);
        var Q = { action: X, activeStartDate: B, value: ge, view: q };
        z && !tn(pe, B) && z(Q);
      },
      [pe, z, ge, q]
    ),
    Xt = y.useCallback(
      function (B, X) {
        var Q = (function () {
          switch (q) {
            case "century":
              return K;
            case "decade":
              return me;
            case "year":
              return ne;
            case "month":
              return Y;
            default:
              throw new Error("Invalid view: ".concat(q, "."));
          }
        })();
        Q && Q(B, X);
      },
      [Y, K, ne, me, q]
    ),
    Wn = y.useCallback(
      function (B, X) {
        if (zn) {
          Xt(B, X);
          var Q = He[He.indexOf(q) + 1];
          if (!Q)
            throw new Error("Attempted to drill down from the lowest view.");
          qt(B), Es(Q);
          var De = {
            action: "drillDown",
            activeStartDate: B,
            value: ge,
            view: Q,
          };
          z && !tn(pe, B) && z(De), Fe && q !== Q && Fe(De), se && se(De);
        }
      },
      [pe, zn, z, Xt, se, Fe, ge, q, He]
    ),
    Vn = y.useCallback(
      function () {
        if (Ts) {
          var B = He[He.indexOf(q) - 1];
          if (!B)
            throw new Error("Attempted to drill up from the highest view.");
          var X = nt(B, pe);
          qt(X), Es(B);
          var Q = { action: "drillUp", activeStartDate: X, value: ge, view: B };
          z && !tn(pe, X) && z(Q), Fe && q !== B && Fe(Q), Pe && Pe(Q);
        }
      },
      [pe, Ts, z, Pe, Fe, ge, q, He]
    ),
    qn = y.useCallback(
      function (B, X) {
        var Q = ge;
        Xt(B, X);
        var De = M && !or(Q),
          Le;
        if (M)
          if (De) Le = nt(Yt, B);
          else {
            if (!Q) throw new Error("previousValue is required");
            if (Array.isArray(Q))
              throw new Error("previousValue must not be an array");
            Le = zh(Yt, Q, B);
          }
        else Le = Ss(B);
        var Xn =
          !M || De || T
            ? oo({
                maxDate: j,
                maxDetail: E,
                minDate: L,
                minDetail: A,
                value: Le,
                view: q,
              })
            : null;
        X.persist(), qt(Xn), Ro(Le);
        var Bo = {
          action: "onChange",
          activeStartDate: Xn,
          value: Le,
          view: q,
        };
        if ((z && !tn(pe, Xn) && z(Bo), re))
          if (M) {
            var Fo = or(Le);
            if (!Fo) re(Le || null, X);
            else if (s) {
              if (Array.isArray(Le))
                throw new Error("value must not be an array");
              re([Le || null, null], X);
            }
          } else re(Le || null, X);
      },
      [pe, s, Ss, T, j, E, L, A, z, re, Xt, M, ge, Yt, q]
    );
  function Lo(B) {
    bs(B);
  }
  function Yn() {
    bs(null);
  }
  y.useImperativeHandle(
    n,
    function () {
      return {
        activeStartDate: pe,
        drillDown: Wn,
        drillUp: Vn,
        onChange: qn,
        setActiveStartDate: $n,
        value: ge,
        view: q,
      };
    },
    [pe, Wn, Vn, qn, $n, ge, q]
  );
  function js(B) {
    var X = B ? Gi(q, pe) : nt(q, pe),
      Q = zn ? Wn : qn,
      De = {
        activeStartDate: X,
        hover: Do,
        locale: _,
        maxDate: j,
        minDate: L,
        onClick: Q,
        onMouseOver: M ? Lo : void 0,
        tileClassName: _o,
        tileContent: Co,
        tileDisabled: Oo,
        value: ge,
        valueType: Yt,
      };
    switch (q) {
      case "century":
        return i.jsx(ef, ft({ formatYear: m, showNeighboringCentury: Eo }, De));
      case "decade":
        return i.jsx(sf, ft({ formatYear: m, showNeighboringDecade: To }, De));
      case "year":
        return i.jsx(uf, ft({ formatMonth: p, formatMonthYear: x }, De));
      case "month":
        return i.jsx(
          xf,
          ft(
            {
              calendarType: a,
              formatDay: d,
              formatLongDate: h,
              formatShortWeekday: v,
              formatWeekday: g,
              onClickWeekNumber: ie,
              onMouseLeave: M ? Yn : void 0,
              showFixedNumberOfWeeks: typeof Oe < "u" ? Oe : Se,
              showNeighboringMonth: So,
              showWeekNumbers: jo,
            },
            De
          )
        );
      default:
        throw new Error("Invalid view: ".concat(q, "."));
    }
  }
  function Io() {
    return No
      ? i.jsx(Vh, {
          activeStartDate: pe,
          drillUp: Vn,
          formatMonthYear: x,
          formatYear: m,
          locale: _,
          maxDate: j,
          minDate: L,
          navigationAriaLabel: Te,
          navigationAriaLive: te,
          navigationLabel: Ce,
          next2AriaLabel: G,
          next2Label: de,
          nextAriaLabel: he,
          nextLabel: ae,
          prev2AriaLabel: ct,
          prev2Label: Nt,
          prevAriaLabel: lt,
          prevLabel: ut,
          setActiveStartDate: $n,
          showDoubleView: Se,
          view: q,
          views: He,
        })
      : null;
  }
  var Mo = Array.isArray(ge) ? ge : [ge];
  return i.jsxs("div", {
    className: ke(
      en,
      M && Mo.length === 1 && "".concat(en, "--selectRange"),
      Se && "".concat(en, "--doubleView"),
      o
    ),
    ref: N,
    children: [
      Io(),
      i.jsxs("div", {
        className: "".concat(en, "__viewContainer"),
        onBlur: M ? Yn : void 0,
        onMouseLeave: M ? Yn : void 0,
        children: [js(), Se ? js(!0) : null],
      }),
    ],
  });
});
const _f = () => {
    const [e, t] = y.useState(new Date()),
      [n, r] = y.useState(void 0),
      [s, a] = y.useState("d-none"),
      o = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      c = [
        "January",
        "Febuary",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
    return (
      y.useEffect(() => {
        if (n) a("d-block");
        else {
          if (n == null) return;
          a("slideOut"),
            setTimeout(() => {
              a("d-none");
            }, 500);
        }
      }, [n]),
      y.useEffect(() => {
        setInterval(() => {
          t(new Date());
        }, 1e3);
      }, []),
      i.jsxs(i.Fragment, {
        children: [
          n &&
            i.jsx("div", {
              onClick: () => r((l) => !l),
              className: "d-block",
              style: {
                position: "fixed",
                left: "0",
                right: "0",
                top: "0",
                bottom: "0",
              },
            }),
          i.jsx("div", {
            className: "clock-panel",
            onClick: () => r(!1),
            children: i.jsx("div", {
              className: "ms-auto col-12 col-sm-8 col-md-8",
              children: i.jsxs("div", {
                className: `inner rounded shadow-lg p-3 text-light bg-dark text-left slideUp ${s}`,
                onClick: (l) => l.stopPropagation(),
                style: { zIndex: 5 },
                children: [
                  i.jsx("div", {
                    className: "mb-2",
                    children: i.jsx("div", {
                      className: "panel",
                      children: i.jsx(jf, { value: e }),
                    }),
                  }),
                  i.jsxs("div", {
                    className: "active p-2 rounded",
                    children: [
                      i.jsx("div", { children: o[e.getDay()] }),
                      i.jsxs("div", {
                        className: "fs-5",
                        children: [
                          c[e.getMonth()],
                          " ",
                          e.getDate(),
                          ", ",
                          e.getFullYear(),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            }),
          }),
          i.jsx("div", {
            className: "ms-auto text-center rounded my-auto py-1",
            style: {
              minWidth: "80px",
              backgroundColor: "#efefef10",
              scrollPadding: "10px",
            },
            onClick: () => r((l) => !l),
            children: i.jsxs("div", {
              className: "c-default",
              style: { cursor: "default" },
              children: [
                i.jsxs("div", {
                  style: { fontSize: ".9em" },
                  children: [
                    e.getHours() < 10 ? `0${e.getHours()}` : e.getHours(),
                    ":",
                    e.getMinutes() < 10 ? `0${e.getMinutes()}` : e.getMinutes(),
                  ],
                }),
                i.jsx("div", {
                  style: { fontSize: ".9em" },
                  children: e.toDateString().split(" ").slice(0, 3).join(" "),
                }),
              ],
            }),
          }),
        ],
      })
    );
  },
  xa = () => {
    const { pinned: e, winIsFs: t, opened: n } = _e();
    return i.jsx("div", {
      children: i.jsx(ve, {
        delay: 800,
        children: i.jsx("div", {
          id: "taskBar",
          className: `fixed-bottom d-flex ${t && "d-none"}`,
          children: i.jsxs("div", {
            id: "taskbarInner",
            className:
              "custom-navmenu mx-auto slideUp p-2 col-11 col-sm-10 col-md-8 col-xl-9 mb-2 bg-dark rounded d-flex text-light",
            children: [
              i.jsx($d, {}),
              i.jsx("div", {
                id: "pinned",
                className: "w-100 d-flex",
                style: { overflowX: "auto" },
                children: [...n.filter((r) => !r.pinned), ...e].map((r) =>
                  i.jsx(
                    Pi,
                    { app: r, onTaskbar: !0 },
                    r == null ? void 0 : r.location
                  )
                ),
              }),
              i.jsx(_f, {}),
            ],
          }),
        }),
      }),
    });
  };
function co(e) {
  return U({
    attr: { viewBox: "0 0 496 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z",
        },
        child: [],
      },
    ],
  })(e);
}
function lo(e) {
  return U({
    attr: { viewBox: "0 0 448 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z",
        },
        child: [],
      },
    ],
  })(e);
}
function uo(e) {
  return U({
    attr: { viewBox: "0 0 448 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z",
        },
        child: [],
      },
    ],
  })(e);
}
function Cf(e) {
  return U({
    attr: { viewBox: "0 0 448 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z",
        },
        child: [],
      },
    ],
  })(e);
}
function Of(e) {
  return U({
    attr: { viewBox: "0 0 512 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z",
        },
        child: [],
      },
    ],
  })(e);
}
function Af(e) {
  return U({
    attr: { viewBox: "0 0 128 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z",
        },
        child: [],
      },
    ],
  })(e);
}
function kf(e) {
  return U({
    attr: { viewBox: "0 0 384 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM96 48c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm-6.3 71.8c3.7-14 16.4-23.8 30.9-23.8l14.8 0c14.5 0 27.2 9.7 30.9 23.8l23.5 88.2c1.4 5.4 2.1 10.9 2.1 16.4c0 35.2-28.8 63.7-64 63.7s-64-28.5-64-63.7c0-5.5 .7-11.1 2.1-16.4l23.5-88.2zM112 336c-8.8 0-16 7.2-16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0z",
        },
        child: [],
      },
    ],
  })(e);
}
function Rf(e) {
  return U({
    attr: { viewBox: "0 0 512 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z",
        },
        child: [],
      },
    ],
  })(e);
}
function Pf(e) {
  return U({
    attr: { viewBox: "0 0 512 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M200 32L56 32C42.7 32 32 42.7 32 56l0 144c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l40-40 79 79-79 79L73 295c-6.9-6.9-17.2-8.9-26.2-5.2S32 302.3 32 312l0 144c0 13.3 10.7 24 24 24l144 0c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-40-40 79-79 79 79-40 40c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l144 0c13.3 0 24-10.7 24-24l0-144c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2l-40 40-79-79 79-79 40 40c6.9 6.9 17.2 8.9 26.2 5.2s14.8-12.5 14.8-22.2l0-144c0-13.3-10.7-24-24-24L312 32c-9.7 0-18.5 5.8-22.2 14.8s-1.7 19.3 5.2 26.2l40 40-79 79-79-79 40-40c6.9-6.9 8.9-17.2 5.2-26.2S209.7 32 200 32z",
        },
        child: [],
      },
    ],
  })(e);
}
function Df(e) {
  return U({
    attr: { viewBox: "0 0 512 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z",
        },
        child: [],
      },
    ],
  })(e);
}
function Lf(e) {
  return U({
    attr: { viewBox: "0 0 384 512" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z",
        },
        child: [],
      },
    ],
  })(e);
}
function ho(e) {
  return U({
    attr: { viewBox: "0 0 1024 1024" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z",
        },
        child: [],
      },
    ],
  })(e);
}
const If = ({ app: e }) => {
    const { upDateWindow: t, killWindow: n, defaults: r, setToTop: s } = _e(),
      { location: a } = e,
      [o, c] = y.useState({ x: 0, y: 0, diffX: 0, diffY: 0 }),
      [l, u] = y.useState({ x: e.x, y: e.y }),
      [d, h] = y.useState(!1),
      p = r(),
      [x, v] = y.useState(!1),
      g = () => {
        e.x && u((f) => ({ ...f, x: e.x })),
          e.y && u((f) => ({ ...f, y: e.y })),
          e.width == window.innerWidth && e.height == window.innerHeight
            ? (t(
                a,
                "height",
                Number(localStorage.getItem("h-" + e.location)) || p.height
              ),
              t(
                a,
                "width",
                Number(localStorage.getItem("w-" + e.location)) || p.width
              ),
              t(a, "x", l.x),
              t(a, "y", l.y))
            : (t(a, "y", 0),
              t(a, "x", 0),
              t(a, "width", window.innerWidth),
              t(a, "height", window.innerHeight));
      };
    function m(f, E) {
      E == "start" && (f.target.style.opacity = "0"),
        E == "start" &&
          setTimeout(() => {
            f.target.style.opacity = "1";
          }, 0);
      const S = f.clientX || f.touches[0].clientX,
        L = f.clientY || f.touches[0].clientY;
      let k = S,
        A = L;
      t(a, "x", k - o.diffX),
        t(a, "y", A),
        A <= 5 || A >= window.innerHeight - 5
          ? (t(a, "x", 0),
            t(a, "y", 0),
            t(a, "height", window.innerHeight - 75),
            t(a, "width", window.innerWidth),
            setTimeout(() => {
              t(a, "width", window.innerWidth);
            }, 20))
          : A > 5 &&
            A < window.innerHeight - 5 &&
            t(
              a,
              "height",
              Number(localStorage.getItem("h-" + e.location)) || p.height
            ),
        k <= 5 || k >= window.innerWidth - 5
          ? (t(a, "x", 0),
            t(a, "y", 0),
            t(a, "height", window.innerHeight - 75),
            t(a, "width", window.innerWidth))
          : k > 5 &&
            k < window.innerWidth - 5 &&
            A > 0 &&
            A < window.innerHeight &&
            t(
              a,
              "width",
              Number(localStorage.getItem("w-" + e.location)) || p.width
            );
    }
    const w = (f, E) => {
      const S = ["w", "s"].includes(f),
        L = Number(localStorage.getItem(f + "-" + e.location)) || 0,
        k = S ? E - L : L - E;
      return (
        setTimeout(() => localStorage.setItem(f + "-" + e.location, E), 0),
        k < 100 && k > -100 ? k : 0
      );
    };
    function T(f) {
      const E = f.touches[0];
      m({ clientX: E.clientX, clientY: E.clientY }, "start");
    }
    function N(f) {
      const E = f.touches[0];
      m({ clientX: E.clientX, clientY: E.clientY });
    }
    function _(f) {
      m({ clientX: touch.clientX, clientY: touch.clientY }, "end");
    }
    const O = (f, E) => {
      const S = e.width,
        L = e.height;
      return {
        n: () => {
          const k = w("n", E),
            A = L + k;
          A > 400 &&
            (localStorage.setItem("h-" + e.location, "" + A),
            t(a, "height", A),
            t(a, "y", E));
        },
        s: () => {
          const k = w("s", E),
            A = L + k;
          A > 400 &&
            (localStorage.setItem("h-" + e.location, "" + A),
            t(a, "height", A));
        },
        e: () => {
          const k = w("e", f),
            A = S + k;
          A > 300 &&
            (localStorage.setItem("w-" + e.location, "" + A),
            t(a, "width", A),
            t(a, "x", f));
        },
        w: () => {
          const k = w("w", f),
            A = S + k;
          A > 300 &&
            (localStorage.setItem("w-" + e.location, "" + A), t(a, "width", A));
        },
      };
    };
    async function j(f, E) {
      E == "start" && (f.target.style.opacity = "0"),
        E == "start" &&
          setTimeout(() => {
            f.target.style.opacity = "1";
          }, 50);
      const { title: S } = f.target,
        L = f.clientX || f.touches[0].clientX,
        k = f.clientY || f.touches[0].clientY;
      O(L, k)[S]();
    }
    return (
      y.useEffect(() => {
        t(
          a,
          "height",
          Number(localStorage.getItem("h-" + e.location)) || p.height
        ),
          t(
            a,
            "width",
            Number(localStorage.getItem("w-" + e.location)) || p.width
          ),
          localStorage.setItem("focused", e.location),
          s(e.location);
      }, []),
      y.useEffect(() => {
        e.height > 0 &&
          e.height < window.innerHeight &&
          localStorage.setItem("h-" + e.location, "" + e.height || p.height),
          e.width > 0 &&
            e.width < window.innerWidth &&
            localStorage.setItem("w-" + e.location, "" + e.width || p.width);
      }, [e.width, e.height]),
      i.jsxs("div", {
        id: `window-${e.location}`,
        className: `rounded window ${
          e.zIndex == 3 ? "shadow-lg" : "shadow-md"
        } ${e.isMini && "d-none"} d-flex`,
        onMouseEnter: () => {
          localStorage.setItem("focused", e.location), s(e.location);
        },
        style: {
          position: "fixed",
          width: e.width + "px",
          height: e.height + "px",
          top: e.y + "px",
          left: e.x + "px",
          zIndex: e.zIndex,
          transition: "all, .1s",
        },
        children: [
          i.jsx("div", {
            className: "divider my-auto h-100 resizeHr",
            title: "e",
            onDragStart: (f) => j(f, "start"),
            onDrag: (f) => j(f),
            onDragEnd: (f) => j(f, !0),
            onTouchStart: (f) => j(f, "start"),
            onTouchMove: (f) => j(f),
            onTouchEnd: (f) => j(f, !0),
            draggable: "true",
            style: {
              width: "2px",
              background: "#0e0e0e",
              height: "80%",
              cursor: "w-resize",
            },
          }),
          i.jsxs("div", {
            className: "growIn",
            style: { width: "calc(100% - 4px)" },
            children: [
              i.jsx("hr", {
                className: "m-0 bg-light border-light resizeHr resN",
                title: "n",
                onDragStart: (f) => j(f, "start"),
                onDrag: (f) => j(f),
                onDragEnd: (f) => j(f, !0),
                onTouchStart: (f) => j(f, "start"),
                onTouchMove: (f) => j(f),
                onTouchEnd: (f) => j(f, !0),
                draggable: "true",
              }),
              i.jsxs("header", {
                draggable: "true",
                id: `window-header-${e.location}`,
                onMouseDown: (f) => {
                  const S = e.width / 2 + f.clientX - f.clientX;
                  c({
                    x: f.clientX,
                    y: f.clientY,
                    diffX: S,
                    diffY: f.screenY - f.clientY,
                  });
                },
                onDoubleClick: g,
                onDragStart: (f) => m(f, "start"),
                onDrag: (f) => m(f, "mid"),
                onDragEnd: (f) => m(f, "end"),
                onTouchStart: (f) => {
                  const S = e.width / 2 + f.touches[0].clientX - f.clientX;
                  c({
                    x: f.clientX,
                    y: f.clientY,
                    diffX: S,
                    diffY: f.screenY - f.clientY,
                  }),
                    T(f);
                },
                onTouchMove: N,
                onTouchEnd: _,
                className: "d-flex window-header text-dark",
                children: [
                  i.jsxs("div", {
                    className: "my-auto ps-2",
                    children: [
                      d
                        ? i.jsx(Di, {
                            className: "fs-5 slideUp aniFast",
                            onClick: () => h((f) => !f),
                          })
                        : i.jsx(ho, {
                            className: "fs-5 slideUp aniFast",
                            onClick: () => v((f) => !f),
                          }),
                      i.jsx(Ne.LazyLoadImage, {
                        effect: "opacity",
                        placeholder: i.jsx(Ee, {}),
                        src: e.icon,
                        width: "20px",
                        draggable: !1,
                        className: "rounded me-1",
                      }),
                      " ",
                      e.name,
                    ],
                  }),
                  i.jsxs("div", {
                    className: "ms-auto py-1",
                    children: [
                      i.jsx("button", {
                        onClick: () => t(e.location, "isMini", !e.isMini),
                        style: { width: "40px", height: "40px" },
                        className:
                          "btn rounded-circle shadow-sm me-1 btn-light",
                        children: "__",
                      }),
                      i.jsx("button", {
                        onClick: g,
                        style: { width: "40px", height: "40px" },
                        className:
                          "btn rounded-circle shadow-sm me-1 btn-light",
                        children: i.jsx(Pf, { className: "h-ico" }),
                      }),
                      i.jsx("button", {
                        onClick: () => n(e.location),
                        style: { width: "40px", height: "40px" },
                        className:
                          "btn rounded-circle shadow-sm me-1 btn-danger",
                        children: i.jsx(Lf, { className: "h-ico" }),
                      }),
                    ],
                  }),
                ],
              }),
              i.jsx("iframe", {
                src: e.location,
                className: (d ? "d-none" : "") + "window-inner",
                draggable: "false",
                id: "iframe-" + e.location,
              }),
              d && i.jsx(Mf, { app: e }),
              i.jsx("hr", {
                className: "m-0 bg-light border-light resizeHr resS",
                draggable: "true",
                title: "s",
                onDragStart: (f) => j(f, "start"),
                onDrag: (f) => j(f),
                onDragEnd: (f) => j(f, !0),
                onTouchStart: (f) => j(f, "start"),
                onTouchMove: (f) => j(f),
                onTouchEnd: (f) => j(f, !0),
                style: { zIndex: 5, position: "relative", bottom: "8px" },
              }),
              x && i.jsx(Bf, { app: e, abouter: h, ddSetter: v }),
            ],
          }),
          i.jsx("div", {
            className: "divider my-auto h-100 resizeHr",
            draggable: "true",
            title: "w",
            onDragStart: (f) => j(f, "start"),
            onDrag: (f) => j(f),
            onDragEnd: (f) => j(f, !0),
            onTouchStart: (f) => j(f, "start"),
            onTouchMove: (f) => j(f),
            onTouchEnd: (f) => j(f, !0),
            style: {
              width: "2px",
              background: "#0e0e0e",
              height: "80%",
              cursor: "e-resize",
            },
          }),
        ],
      })
    );
  },
  Mf = ({ app: e = {} }) =>
    i.jsx("div", {
      className: "w-100 darkTheme p-3 bg-dark",
      id: "window-inner",
      children: i.jsxs("div", {
        className: "slideUp aniFast",
        children: [
          i.jsxs("h3", {
            className: "mb-1",
            children: [
              " ",
              i.jsx(Ne.LazyLoadImage, {
                effect: "opacity",
                placeholder: i.jsx(Ee, {}),
                src: e.icon,
                height: "30px",
                alt: "",
                className: "icon",
              }),
              " ",
              e.name,
            ],
          }),
          i.jsx("div", {
            className: "",
            children: i.jsx("a", {
              target: "_blank",
              href: e.location,
              children: e.location,
            }),
          }),
          i.jsxs("div", {
            className: "shadow-sm btn btn-dark rounded p-1 pt-0 d-inline",
            children: [
              i.jsx(Dd, { className: "icon" }),
              " ",
              e == null ? void 0 : e.category,
            ],
          }),
          i.jsx("pre", {
            className: "mt-3 pre",
            style: {
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              fontSize: "inherit",
            },
            children: (e == null ? void 0 : e.about) || "",
          }),
        ],
      }),
    }),
  Bf = ({ app: e, abouter: t, ddSetter: n }) => {
    const r = Re();
    return i.jsx("div", {
      className: "darkTheme rounded",
      style: { position: "fixed", left: e.x + "px", top: e.y + "px" },
      children: i.jsxs("div", {
        className: "rounded shadow-lg p-3 panel ",
        style: { width: "220px", zIndex: e.zIndex + 10 },
        children: [
          i.jsx("div", {
            children: i.jsx(Di, {
              className: "fs-5",
              onClick: () => {
                n((s) => !s), r(-1);
              },
            }),
          }),
          i.jsxs("div", {
            className: "rounded pt-1",
            children: [
              i.jsxs("div", {
                className: "border p-1 rounded c-pointer",
                onClick: () => {
                  n((s) => !s), t((s) => !s);
                },
                children: [
                  i.jsx(ho, { className: "text-dark icon" }),
                  " App info",
                ],
              }),
              i.jsx("div", {
                className: "border p-1 mt-1 rounded c-pointer",
                onClick: () => {
                  n((s) => !s), window.open(e.location, "_blank");
                },
                children: i.jsxs("div", {
                  className: "d-flex",
                  children: [
                    i.jsx(Md, { className: "text-dark my-auto me-1" }),
                    " Run in browser",
                  ],
                }),
              }),
            ],
          }),
        ],
      }),
    });
  },
  Ff = () => {
    const { opened: e } = _e();
    return i.jsx(i.Fragment, {
      children: e.map((t) => i.jsx(If, { app: t }, t.location)),
    });
  },
  Hf = "/bg.jpg",
  Uf = "/sprintetName.png";
var fo = { exports: {} },
  zf = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",
  $f = zf,
  Wf = $f;
function mo() {}
function po() {}
po.resetWarningCache = mo;
var Vf = function () {
  function e(r, s, a, o, c, l) {
    if (l !== Wf) {
      var u = new Error(
        "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
      );
      throw ((u.name = "Invariant Violation"), u);
    }
  }
  e.isRequired = e;
  function t() {
    return e;
  }
  var n = {
    array: e,
    bigint: e,
    bool: e,
    func: e,
    number: e,
    object: e,
    string: e,
    symbol: e,
    any: e,
    arrayOf: t,
    element: e,
    elementType: e,
    instanceOf: t,
    node: e,
    objectOf: t,
    oneOf: t,
    oneOfType: t,
    shape: t,
    exact: t,
    checkPropTypes: po,
    resetWarningCache: mo,
  };
  return (n.PropTypes = n), n;
};
fo.exports = Vf();
var qf = fo.exports;
const $ = Bt(qf);
function Yf(e) {
  return e && typeof e == "object" && "default" in e ? e.default : e;
}
var go = y,
  Xf = Yf(go);
function ba(e, t, n) {
  return (
    t in e
      ? Object.defineProperty(e, t, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        })
      : (e[t] = n),
    e
  );
}
function Jf(e, t) {
  (e.prototype = Object.create(t.prototype)),
    (e.prototype.constructor = e),
    (e.__proto__ = t);
}
var Gf = !!(
  typeof window < "u" &&
  window.document &&
  window.document.createElement
);
function Kf(e, t, n) {
  if (typeof e != "function")
    throw new Error("Expected reducePropsToState to be a function.");
  if (typeof t != "function")
    throw new Error("Expected handleStateChangeOnClient to be a function.");
  if (typeof n < "u" && typeof n != "function")
    throw new Error(
      "Expected mapStateOnServer to either be undefined or a function."
    );
  function r(s) {
    return s.displayName || s.name || "Component";
  }
  return function (a) {
    if (typeof a != "function")
      throw new Error("Expected WrappedComponent to be a React component.");
    var o = [],
      c;
    function l() {
      (c = e(
        o.map(function (d) {
          return d.props;
        })
      )),
        u.canUseDOM ? t(c) : n && (c = n(c));
    }
    var u = (function (d) {
      Jf(h, d);
      function h() {
        return d.apply(this, arguments) || this;
      }
      (h.peek = function () {
        return c;
      }),
        (h.rewind = function () {
          if (h.canUseDOM)
            throw new Error(
              "You may only call rewind() on the server. Call peek() to read the current state."
            );
          var v = c;
          return (c = void 0), (o = []), v;
        });
      var p = h.prototype;
      return (
        (p.UNSAFE_componentWillMount = function () {
          o.push(this), l();
        }),
        (p.componentDidUpdate = function () {
          l();
        }),
        (p.componentWillUnmount = function () {
          var v = o.indexOf(this);
          o.splice(v, 1), l();
        }),
        (p.render = function () {
          return Xf.createElement(a, this.props);
        }),
        h
      );
    })(go.PureComponent);
    return (
      ba(u, "displayName", "SideEffect(" + r(a) + ")"),
      ba(u, "canUseDOM", Gf),
      u
    );
  };
}
var Qf = Kf;
const Zf = Bt(Qf);
var em = typeof Element < "u",
  tm = typeof Map == "function",
  nm = typeof Set == "function",
  rm = typeof ArrayBuffer == "function" && !!ArrayBuffer.isView;
function fn(e, t) {
  if (e === t) return !0;
  if (e && t && typeof e == "object" && typeof t == "object") {
    if (e.constructor !== t.constructor) return !1;
    var n, r, s;
    if (Array.isArray(e)) {
      if (((n = e.length), n != t.length)) return !1;
      for (r = n; r-- !== 0; ) if (!fn(e[r], t[r])) return !1;
      return !0;
    }
    var a;
    if (tm && e instanceof Map && t instanceof Map) {
      if (e.size !== t.size) return !1;
      for (a = e.entries(); !(r = a.next()).done; )
        if (!t.has(r.value[0])) return !1;
      for (a = e.entries(); !(r = a.next()).done; )
        if (!fn(r.value[1], t.get(r.value[0]))) return !1;
      return !0;
    }
    if (nm && e instanceof Set && t instanceof Set) {
      if (e.size !== t.size) return !1;
      for (a = e.entries(); !(r = a.next()).done; )
        if (!t.has(r.value[0])) return !1;
      return !0;
    }
    if (rm && ArrayBuffer.isView(e) && ArrayBuffer.isView(t)) {
      if (((n = e.length), n != t.length)) return !1;
      for (r = n; r-- !== 0; ) if (e[r] !== t[r]) return !1;
      return !0;
    }
    if (e.constructor === RegExp)
      return e.source === t.source && e.flags === t.flags;
    if (
      e.valueOf !== Object.prototype.valueOf &&
      typeof e.valueOf == "function" &&
      typeof t.valueOf == "function"
    )
      return e.valueOf() === t.valueOf();
    if (
      e.toString !== Object.prototype.toString &&
      typeof e.toString == "function" &&
      typeof t.toString == "function"
    )
      return e.toString() === t.toString();
    if (((s = Object.keys(e)), (n = s.length), n !== Object.keys(t).length))
      return !1;
    for (r = n; r-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(t, s[r])) return !1;
    if (em && e instanceof Element) return !1;
    for (r = n; r-- !== 0; )
      if (
        !(
          (s[r] === "_owner" || s[r] === "__v" || s[r] === "__o") &&
          e.$$typeof
        ) &&
        !fn(e[s[r]], t[s[r]])
      )
        return !1;
    return !0;
  }
  return e !== e && t !== t;
}
var sm = function (t, n) {
  try {
    return fn(t, n);
  } catch (r) {
    if ((r.message || "").match(/stack|recursion/i))
      return console.warn("react-fast-compare cannot handle circular refs"), !1;
    throw r;
  }
};
const am = Bt(sm);
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/ var wa = Object.getOwnPropertySymbols,
  im = Object.prototype.hasOwnProperty,
  om = Object.prototype.propertyIsEnumerable;
function cm(e) {
  if (e == null)
    throw new TypeError(
      "Object.assign cannot be called with null or undefined"
    );
  return Object(e);
}
function lm() {
  try {
    if (!Object.assign) return !1;
    var e = new String("abc");
    if (((e[5] = "de"), Object.getOwnPropertyNames(e)[0] === "5")) return !1;
    for (var t = {}, n = 0; n < 10; n++) t["_" + String.fromCharCode(n)] = n;
    var r = Object.getOwnPropertyNames(t).map(function (a) {
      return t[a];
    });
    if (r.join("") !== "0123456789") return !1;
    var s = {};
    return (
      "abcdefghijklmnopqrst".split("").forEach(function (a) {
        s[a] = a;
      }),
      Object.keys(Object.assign({}, s)).join("") === "abcdefghijklmnopqrst"
    );
  } catch {
    return !1;
  }
}
var um = lm()
  ? Object.assign
  : function (e, t) {
      for (var n, r = cm(e), s, a = 1; a < arguments.length; a++) {
        n = Object(arguments[a]);
        for (var o in n) im.call(n, o) && (r[o] = n[o]);
        if (wa) {
          s = wa(n);
          for (var c = 0; c < s.length; c++)
            om.call(n, s[c]) && (r[s[c]] = n[s[c]]);
        }
      }
      return r;
    };
const dm = Bt(um);
var rt = {
    BODY: "bodyAttributes",
    HTML: "htmlAttributes",
    TITLE: "titleAttributes",
  },
  D = {
    BASE: "base",
    BODY: "body",
    HEAD: "head",
    HTML: "html",
    LINK: "link",
    META: "meta",
    NOSCRIPT: "noscript",
    SCRIPT: "script",
    STYLE: "style",
    TITLE: "title",
  };
Object.keys(D).map(function (e) {
  return D[e];
});
var W = {
    CHARSET: "charset",
    CSS_TEXT: "cssText",
    HREF: "href",
    HTTPEQUIV: "http-equiv",
    INNER_HTML: "innerHTML",
    ITEM_PROP: "itemprop",
    NAME: "name",
    PROPERTY: "property",
    REL: "rel",
    SRC: "src",
    TARGET: "target",
  },
  bn = {
    accesskey: "accessKey",
    charset: "charSet",
    class: "className",
    contenteditable: "contentEditable",
    contextmenu: "contextMenu",
    "http-equiv": "httpEquiv",
    itemprop: "itemProp",
    tabindex: "tabIndex",
  },
  Mt = {
    DEFAULT_TITLE: "defaultTitle",
    DEFER: "defer",
    ENCODE_SPECIAL_CHARACTERS: "encodeSpecialCharacters",
    ON_CHANGE_CLIENT_STATE: "onChangeClientState",
    TITLE_TEMPLATE: "titleTemplate",
  },
  hm = Object.keys(bn).reduce(function (e, t) {
    return (e[bn[t]] = t), e;
  }, {}),
  fm = [D.NOSCRIPT, D.SCRIPT, D.STYLE],
  Me = "data-react-helmet",
  mm =
    typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
      ? function (e) {
          return typeof e;
        }
      : function (e) {
          return e &&
            typeof Symbol == "function" &&
            e.constructor === Symbol &&
            e !== Symbol.prototype
            ? "symbol"
            : typeof e;
        },
  pm = function (e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  },
  gm = (function () {
    function e(t, n) {
      for (var r = 0; r < n.length; r++) {
        var s = n[r];
        (s.enumerable = s.enumerable || !1),
          (s.configurable = !0),
          "value" in s && (s.writable = !0),
          Object.defineProperty(t, s.key, s);
      }
    }
    return function (t, n, r) {
      return n && e(t.prototype, n), r && e(t, r), t;
    };
  })(),
  ye =
    Object.assign ||
    function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var r in n)
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
      }
      return e;
    },
  ym = function (e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError(
        "Super expression must either be null or a function, not " + typeof t
      );
    (e.prototype = Object.create(t && t.prototype, {
      constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
    })),
      t &&
        (Object.setPrototypeOf
          ? Object.setPrototypeOf(e, t)
          : (e.__proto__ = t));
  },
  Na = function (e, t) {
    var n = {};
    for (var r in e)
      t.indexOf(r) >= 0 ||
        (Object.prototype.hasOwnProperty.call(e, r) && (n[r] = e[r]));
    return n;
  },
  vm = function (e, t) {
    if (!e)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    return t && (typeof t == "object" || typeof t == "function") ? t : e;
  },
  $r = function (t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
    return n === !1
      ? String(t)
      : String(t)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#x27;");
  },
  xm = function (t) {
    var n = pt(t, D.TITLE),
      r = pt(t, Mt.TITLE_TEMPLATE);
    if (r && n)
      return r.replace(/%s/g, function () {
        return Array.isArray(n) ? n.join("") : n;
      });
    var s = pt(t, Mt.DEFAULT_TITLE);
    return n || s || void 0;
  },
  bm = function (t) {
    return pt(t, Mt.ON_CHANGE_CLIENT_STATE) || function () {};
  },
  cr = function (t, n) {
    return n
      .filter(function (r) {
        return typeof r[t] < "u";
      })
      .map(function (r) {
        return r[t];
      })
      .reduce(function (r, s) {
        return ye({}, r, s);
      }, {});
  },
  wm = function (t, n) {
    return n
      .filter(function (r) {
        return typeof r[D.BASE] < "u";
      })
      .map(function (r) {
        return r[D.BASE];
      })
      .reverse()
      .reduce(function (r, s) {
        if (!r.length)
          for (var a = Object.keys(s), o = 0; o < a.length; o++) {
            var c = a[o],
              l = c.toLowerCase();
            if (t.indexOf(l) !== -1 && s[l]) return r.concat(s);
          }
        return r;
      }, []);
  },
  St = function (t, n, r) {
    var s = {};
    return r
      .filter(function (a) {
        return Array.isArray(a[t])
          ? !0
          : (typeof a[t] < "u" &&
              Sm(
                "Helmet: " +
                  t +
                  ' should be of type "Array". Instead found type "' +
                  mm(a[t]) +
                  '"'
              ),
            !1);
      })
      .map(function (a) {
        return a[t];
      })
      .reverse()
      .reduce(function (a, o) {
        var c = {};
        o.filter(function (p) {
          for (var x = void 0, v = Object.keys(p), g = 0; g < v.length; g++) {
            var m = v[g],
              w = m.toLowerCase();
            n.indexOf(w) !== -1 &&
              !(x === W.REL && p[x].toLowerCase() === "canonical") &&
              !(w === W.REL && p[w].toLowerCase() === "stylesheet") &&
              (x = w),
              n.indexOf(m) !== -1 &&
                (m === W.INNER_HTML || m === W.CSS_TEXT || m === W.ITEM_PROP) &&
                (x = m);
          }
          if (!x || !p[x]) return !1;
          var T = p[x].toLowerCase();
          return (
            s[x] || (s[x] = {}),
            c[x] || (c[x] = {}),
            s[x][T] ? !1 : ((c[x][T] = !0), !0)
          );
        })
          .reverse()
          .forEach(function (p) {
            return a.push(p);
          });
        for (var l = Object.keys(c), u = 0; u < l.length; u++) {
          var d = l[u],
            h = dm({}, s[d], c[d]);
          s[d] = h;
        }
        return a;
      }, [])
      .reverse();
  },
  pt = function (t, n) {
    for (var r = t.length - 1; r >= 0; r--) {
      var s = t[r];
      if (s.hasOwnProperty(n)) return s[n];
    }
    return null;
  },
  Nm = function (t) {
    return {
      baseTag: wm([W.HREF, W.TARGET], t),
      bodyAttributes: cr(rt.BODY, t),
      defer: pt(t, Mt.DEFER),
      encode: pt(t, Mt.ENCODE_SPECIAL_CHARACTERS),
      htmlAttributes: cr(rt.HTML, t),
      linkTags: St(D.LINK, [W.REL, W.HREF], t),
      metaTags: St(
        D.META,
        [W.NAME, W.CHARSET, W.HTTPEQUIV, W.PROPERTY, W.ITEM_PROP],
        t
      ),
      noscriptTags: St(D.NOSCRIPT, [W.INNER_HTML], t),
      onChangeClientState: bm(t),
      scriptTags: St(D.SCRIPT, [W.SRC, W.INNER_HTML], t),
      styleTags: St(D.STYLE, [W.CSS_TEXT], t),
      title: xm(t),
      titleAttributes: cr(rt.TITLE, t),
    };
  },
  Wr = (function () {
    var e = Date.now();
    return function (t) {
      var n = Date.now();
      n - e > 16
        ? ((e = n), t(n))
        : setTimeout(function () {
            Wr(t);
          }, 0);
    };
  })(),
  Ea = function (t) {
    return clearTimeout(t);
  },
  Em =
    typeof window < "u"
      ? (window.requestAnimationFrame &&
          window.requestAnimationFrame.bind(window)) ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        Wr
      : global.requestAnimationFrame || Wr,
  Tm =
    typeof window < "u"
      ? window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        Ea
      : global.cancelAnimationFrame || Ea,
  Sm = function (t) {
    return console && typeof console.warn == "function" && console.warn(t);
  },
  jt = null,
  jm = function (t) {
    jt && Tm(jt),
      t.defer
        ? (jt = Em(function () {
            Ta(t, function () {
              jt = null;
            });
          }))
        : (Ta(t), (jt = null));
  },
  Ta = function (t, n) {
    var r = t.baseTag,
      s = t.bodyAttributes,
      a = t.htmlAttributes,
      o = t.linkTags,
      c = t.metaTags,
      l = t.noscriptTags,
      u = t.onChangeClientState,
      d = t.scriptTags,
      h = t.styleTags,
      p = t.title,
      x = t.titleAttributes;
    Vr(D.BODY, s), Vr(D.HTML, a), _m(p, x);
    var v = {
        baseTag: dt(D.BASE, r),
        linkTags: dt(D.LINK, o),
        metaTags: dt(D.META, c),
        noscriptTags: dt(D.NOSCRIPT, l),
        scriptTags: dt(D.SCRIPT, d),
        styleTags: dt(D.STYLE, h),
      },
      g = {},
      m = {};
    Object.keys(v).forEach(function (w) {
      var T = v[w],
        N = T.newTags,
        _ = T.oldTags;
      N.length && (g[w] = N), _.length && (m[w] = v[w].oldTags);
    }),
      n && n(),
      u(t, g, m);
  },
  yo = function (t) {
    return Array.isArray(t) ? t.join("") : t;
  },
  _m = function (t, n) {
    typeof t < "u" && document.title !== t && (document.title = yo(t)),
      Vr(D.TITLE, n);
  },
  Vr = function (t, n) {
    var r = document.getElementsByTagName(t)[0];
    if (r) {
      for (
        var s = r.getAttribute(Me),
          a = s ? s.split(",") : [],
          o = [].concat(a),
          c = Object.keys(n),
          l = 0;
        l < c.length;
        l++
      ) {
        var u = c[l],
          d = n[u] || "";
        r.getAttribute(u) !== d && r.setAttribute(u, d),
          a.indexOf(u) === -1 && a.push(u);
        var h = o.indexOf(u);
        h !== -1 && o.splice(h, 1);
      }
      for (var p = o.length - 1; p >= 0; p--) r.removeAttribute(o[p]);
      a.length === o.length
        ? r.removeAttribute(Me)
        : r.getAttribute(Me) !== c.join(",") && r.setAttribute(Me, c.join(","));
    }
  },
  dt = function (t, n) {
    var r = document.head || document.querySelector(D.HEAD),
      s = r.querySelectorAll(t + "[" + Me + "]"),
      a = Array.prototype.slice.call(s),
      o = [],
      c = void 0;
    return (
      n &&
        n.length &&
        n.forEach(function (l) {
          var u = document.createElement(t);
          for (var d in l)
            if (l.hasOwnProperty(d))
              if (d === W.INNER_HTML) u.innerHTML = l.innerHTML;
              else if (d === W.CSS_TEXT)
                u.styleSheet
                  ? (u.styleSheet.cssText = l.cssText)
                  : u.appendChild(document.createTextNode(l.cssText));
              else {
                var h = typeof l[d] > "u" ? "" : l[d];
                u.setAttribute(d, h);
              }
          u.setAttribute(Me, "true"),
            a.some(function (p, x) {
              return (c = x), u.isEqualNode(p);
            })
              ? a.splice(c, 1)
              : o.push(u);
        }),
      a.forEach(function (l) {
        return l.parentNode.removeChild(l);
      }),
      o.forEach(function (l) {
        return r.appendChild(l);
      }),
      { oldTags: a, newTags: o }
    );
  },
  vo = function (t) {
    return Object.keys(t).reduce(function (n, r) {
      var s = typeof t[r] < "u" ? r + '="' + t[r] + '"' : "" + r;
      return n ? n + " " + s : s;
    }, "");
  },
  Cm = function (t, n, r, s) {
    var a = vo(r),
      o = yo(n);
    return a
      ? "<" + t + " " + Me + '="true" ' + a + ">" + $r(o, s) + "</" + t + ">"
      : "<" + t + " " + Me + '="true">' + $r(o, s) + "</" + t + ">";
  },
  Om = function (t, n, r) {
    return n.reduce(function (s, a) {
      var o = Object.keys(a)
          .filter(function (u) {
            return !(u === W.INNER_HTML || u === W.CSS_TEXT);
          })
          .reduce(function (u, d) {
            var h = typeof a[d] > "u" ? d : d + '="' + $r(a[d], r) + '"';
            return u ? u + " " + h : h;
          }, ""),
        c = a.innerHTML || a.cssText || "",
        l = fm.indexOf(t) === -1;
      return (
        s +
        "<" +
        t +
        " " +
        Me +
        '="true" ' +
        o +
        (l ? "/>" : ">" + c + "</" + t + ">")
      );
    }, "");
  },
  xo = function (t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return Object.keys(t).reduce(function (r, s) {
      return (r[bn[s] || s] = t[s]), r;
    }, n);
  },
  Am = function (t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return Object.keys(t).reduce(function (r, s) {
      return (r[hm[s] || s] = t[s]), r;
    }, n);
  },
  km = function (t, n, r) {
    var s,
      a = ((s = { key: n }), (s[Me] = !0), s),
      o = xo(r, a);
    return [H.createElement(D.TITLE, o, n)];
  },
  Rm = function (t, n) {
    return n.map(function (r, s) {
      var a,
        o = ((a = { key: s }), (a[Me] = !0), a);
      return (
        Object.keys(r).forEach(function (c) {
          var l = bn[c] || c;
          if (l === W.INNER_HTML || l === W.CSS_TEXT) {
            var u = r.innerHTML || r.cssText;
            o.dangerouslySetInnerHTML = { __html: u };
          } else o[l] = r[c];
        }),
        H.createElement(t, o)
      );
    });
  },
  Ve = function (t, n, r) {
    switch (t) {
      case D.TITLE:
        return {
          toComponent: function () {
            return km(t, n.title, n.titleAttributes);
          },
          toString: function () {
            return Cm(t, n.title, n.titleAttributes, r);
          },
        };
      case rt.BODY:
      case rt.HTML:
        return {
          toComponent: function () {
            return xo(n);
          },
          toString: function () {
            return vo(n);
          },
        };
      default:
        return {
          toComponent: function () {
            return Rm(t, n);
          },
          toString: function () {
            return Om(t, n, r);
          },
        };
    }
  },
  bo = function (t) {
    var n = t.baseTag,
      r = t.bodyAttributes,
      s = t.encode,
      a = t.htmlAttributes,
      o = t.linkTags,
      c = t.metaTags,
      l = t.noscriptTags,
      u = t.scriptTags,
      d = t.styleTags,
      h = t.title,
      p = h === void 0 ? "" : h,
      x = t.titleAttributes;
    return {
      base: Ve(D.BASE, n, s),
      bodyAttributes: Ve(rt.BODY, r, s),
      htmlAttributes: Ve(rt.HTML, a, s),
      link: Ve(D.LINK, o, s),
      meta: Ve(D.META, c, s),
      noscript: Ve(D.NOSCRIPT, l, s),
      script: Ve(D.SCRIPT, u, s),
      style: Ve(D.STYLE, d, s),
      title: Ve(D.TITLE, { title: p, titleAttributes: x }, s),
    };
  },
  Pm = function (t) {
    var n, r;
    return (
      (r = n =
        (function (s) {
          ym(a, s);
          function a() {
            return pm(this, a), vm(this, s.apply(this, arguments));
          }
          return (
            (a.prototype.shouldComponentUpdate = function (c) {
              return !am(this.props, c);
            }),
            (a.prototype.mapNestedChildrenToProps = function (c, l) {
              if (!l) return null;
              switch (c.type) {
                case D.SCRIPT:
                case D.NOSCRIPT:
                  return { innerHTML: l };
                case D.STYLE:
                  return { cssText: l };
              }
              throw new Error(
                "<" +
                  c.type +
                  " /> elements are self-closing and can not contain children. Refer to our API for more information."
              );
            }),
            (a.prototype.flattenArrayTypeChildren = function (c) {
              var l,
                u = c.child,
                d = c.arrayTypeChildren,
                h = c.newChildProps,
                p = c.nestedChildren;
              return ye(
                {},
                d,
                ((l = {}),
                (l[u.type] = [].concat(d[u.type] || [], [
                  ye({}, h, this.mapNestedChildrenToProps(u, p)),
                ])),
                l)
              );
            }),
            (a.prototype.mapObjectTypeChildren = function (c) {
              var l,
                u,
                d = c.child,
                h = c.newProps,
                p = c.newChildProps,
                x = c.nestedChildren;
              switch (d.type) {
                case D.TITLE:
                  return ye(
                    {},
                    h,
                    ((l = {}),
                    (l[d.type] = x),
                    (l.titleAttributes = ye({}, p)),
                    l)
                  );
                case D.BODY:
                  return ye({}, h, { bodyAttributes: ye({}, p) });
                case D.HTML:
                  return ye({}, h, { htmlAttributes: ye({}, p) });
              }
              return ye({}, h, ((u = {}), (u[d.type] = ye({}, p)), u));
            }),
            (a.prototype.mapArrayTypeChildrenToProps = function (c, l) {
              var u = ye({}, l);
              return (
                Object.keys(c).forEach(function (d) {
                  var h;
                  u = ye({}, u, ((h = {}), (h[d] = c[d]), h));
                }),
                u
              );
            }),
            (a.prototype.warnOnInvalidChildren = function (c, l) {
              return !0;
            }),
            (a.prototype.mapChildrenToProps = function (c, l) {
              var u = this,
                d = {};
              return (
                H.Children.forEach(c, function (h) {
                  if (!(!h || !h.props)) {
                    var p = h.props,
                      x = p.children,
                      v = Na(p, ["children"]),
                      g = Am(v);
                    switch ((u.warnOnInvalidChildren(h, x), h.type)) {
                      case D.LINK:
                      case D.META:
                      case D.NOSCRIPT:
                      case D.SCRIPT:
                      case D.STYLE:
                        d = u.flattenArrayTypeChildren({
                          child: h,
                          arrayTypeChildren: d,
                          newChildProps: g,
                          nestedChildren: x,
                        });
                        break;
                      default:
                        l = u.mapObjectTypeChildren({
                          child: h,
                          newProps: l,
                          newChildProps: g,
                          nestedChildren: x,
                        });
                        break;
                    }
                  }
                }),
                (l = this.mapArrayTypeChildrenToProps(d, l)),
                l
              );
            }),
            (a.prototype.render = function () {
              var c = this.props,
                l = c.children,
                u = Na(c, ["children"]),
                d = ye({}, u);
              return (
                l && (d = this.mapChildrenToProps(l, d)), H.createElement(t, d)
              );
            }),
            gm(a, null, [
              {
                key: "canUseDOM",
                set: function (c) {
                  t.canUseDOM = c;
                },
              },
            ]),
            a
          );
        })(H.Component)),
      (n.propTypes = {
        base: $.object,
        bodyAttributes: $.object,
        children: $.oneOfType([$.arrayOf($.node), $.node]),
        defaultTitle: $.string,
        defer: $.bool,
        encodeSpecialCharacters: $.bool,
        htmlAttributes: $.object,
        link: $.arrayOf($.object),
        meta: $.arrayOf($.object),
        noscript: $.arrayOf($.object),
        onChangeClientState: $.func,
        script: $.arrayOf($.object),
        style: $.arrayOf($.object),
        title: $.string,
        titleAttributes: $.object,
        titleTemplate: $.string,
      }),
      (n.defaultProps = { defer: !0, encodeSpecialCharacters: !0 }),
      (n.peek = t.peek),
      (n.rewind = function () {
        var s = t.rewind();
        return (
          s ||
            (s = bo({
              baseTag: [],
              bodyAttributes: {},
              htmlAttributes: {},
              linkTags: [],
              metaTags: [],
              noscriptTags: [],
              scriptTags: [],
              styleTags: [],
              title: "",
              titleAttributes: {},
            })),
          s
        );
      }),
      r
    );
  },
  Dm = function () {
    return null;
  },
  Lm = Zf(Nm, jm, bo)(Dm),
  qr = Pm(Lm);
qr.renderStatic = qr.rewind;
const Im = () => (
    y.useEffect(() => {
      setTimeout(() => {
        const e = document.head,
          t = document.createElement("script");
        (t.type = "text/javascript"),
          (t.async = !0),
          (t.src = "https://cse.google.com/cse.js?cx=a14c3c1c7a7be4d0c"),
          e.appendChild(t);
      }, 3200);
    }, []),
    i.jsxs("div", {
      className: "bg p-0",
      style: {
        position: "fixed",
        left: "0",
        right: "0",
        top: "0",
        bottom: "0",
        zIndex: 0,
        background: "#0e0e0e",
      },
      children: [
        i.jsx(Ne.LazyLoadImage, {
          effect: "opacity",
          className: "fadeIn",
          draggable: !1,
          placeholder: i.jsx(Ee, {}),
          src: Hf,
          height: "100%",
          alt: "bg",
          style: { opacity: 0.3, minWidth: "100vw", alignSelf: "center" },
        }),
        i.jsx("div", {
          className: "fixed-top d-flex w-100 pt-md-5",
          style: { height: "90%" },
          children: i.jsx(ve, {
            delay: 1300,
            children: i.jsxs("div", {
              className: "m-auto mt-md-5 bg-dark p-4 shadow-lg slideUp",
              style: { maxWidth: "70vw", width: "400px", borderRadius: "18px" },
              children: [
                i.jsx(xe, {
                  to: "/",
                  children: i.jsx(Ne.LazyLoadImage, {
                    effect: "opacity",
                    src: Uf,
                    draggable: !1,
                    className: "rounded growIn  img-fluid",
                    placeholder: i.jsx(Ee, {}),
                    alt: "Sprintet Name Logo",
                    about: "Sprintet name logo image",
                  }),
                }),
                i.jsx("div", { className: "no-theme w-100" }),
                i.jsx(qr, {
                  children: i.jsx("script", {
                    async: !0,
                    type: "text/javascript",
                    src: "https://cse.google.com/cse.js?cx=a14c3c1c7a7be4d0c",
                  }),
                }),
                i.jsx("div", { className: "gcse-search" }),
              ],
            }),
          }),
        }),
      ],
    })
  ),
  Mm = () => {
    const [e, t] = y.useState({ vh: window.innerHeight, sh: scrollY });
    return (
      y.useEffect(() => {
        const n = document.getElementById("contact");
        onscroll = () => {
          const r = n.getBoundingClientRect(),
            { bottom: s } = r,
            a = window.innerHeight;
          t({ vh: a, sh: s });
        };
      }, []),
      i.jsxs("div", {
        className: "p-3 slideUp container darkTheme",
        children: [
          i.jsx("h2", {
            className: "mb-0",
            children: i.jsx(xe, {
              to: "/",
              children: i.jsx(Ne.LazyLoadImage, {
                effect: "opacity",
                placeholder: i.jsx(Ee, {}),
                src: "/sprintetName.png",
                height: "80px",
                alt: "",
                className: "icon",
              }),
            }),
          }),
          i.jsxs("div", {
            className: "mb-3",
            children: [
              "Learn more about ",
              i.jsx(xe, {
                to: "/contact",
                className: "",
                style: { textDecoration: "underline" },
                children: "Chia Ernest",
              }),
              ", the guy who owes and runs this place.",
            ],
          }),
          i.jsx("p", {
            children: i.jsxs("div", {
              className: "container",
              children: [
                i.jsx("p", {
                  className: "",
                  children:
                    "Sprintet is a dynamic programming startup dedicated to delivering cutting-edge software solutions that drive business growth. We specialize in agile development methodologies, ensuring efficient project execution, high-quality results, and continuous improvement.",
                }),
                i.jsx("p", {
                  className: "mb-4",
                  children:
                    "Our team of skilled programmers and engineers are passionate about transforming ideas into reality. We leverage the latest technologies and industry best practices to create innovative solutions that meet your unique needs. Whether you're looking to develop a new mobile app, build a robust web platform, or modernize your existing systems, Sprintet is your trusted partner.",
                }),
                i.jsx("h4", {
                  className: "",
                  children: "Why Choose Sprintet?",
                }),
                i.jsxs("ul", {
                  className: "mb-4",
                  children: [
                    i.jsxs("li", {
                      className: "my-2",
                      children: [
                        i.jsx("strong", { children: "Agile Development:" }),
                        " We embrace agile principles for flexibility, collaboration, and rapid delivery.",
                      ],
                    }),
                    i.jsxs("li", {
                      className: "my-2",
                      children: [
                        i.jsx("strong", { children: "Custom Solutions:" }),
                        " Our team tailors solutions to your specific requirements and goals.",
                      ],
                    }),
                    i.jsxs("li", {
                      className: "my-2",
                      children: [
                        i.jsx("strong", {
                          children: "Technological Expertise:",
                        }),
                        " We stay up-to-date with the latest trends and technologies.",
                      ],
                    }),
                    i.jsxs("li", {
                      className: "my-2",
                      children: [
                        i.jsx("strong", {
                          children: "Client-Centric Approach:",
                        }),
                        " Your satisfaction is our top priority.",
                      ],
                    }),
                    i.jsxs("li", {
                      className: "my-2",
                      children: [
                        i.jsx("strong", { children: "Experienced Team:" }),
                        " Our team has a proven track record of delivering successful projects.",
                      ],
                    }),
                    i.jsxs("li", {
                      className: "my-2",
                      children: [
                        i.jsx("strong", {
                          children: "Transparent Communication:",
                        }),
                        " We maintain open and honest communication throughout the development process.",
                      ],
                    }),
                    i.jsxs("li", {
                      className: "my-2",
                      children: [
                        i.jsx("strong", { children: "Scalability:" }),
                        " Our solutions can grow with your business as your needs evolve. Let's Build Something Great Together.",
                      ],
                    }),
                  ],
                }),
                "Contact us today to discuss your project and explore how Sprintet can help you achieve your business objectives. We're excited to partner with you and deliver exceptional results.",
                i.jsx("h4", {
                  className: " mt-4",
                  children: "Let's Build Something Great Together.",
                }),
                i.jsx("p", {
                  className: "",
                  children:
                    "Contact us today to discuss your project and explore how Sprintet can help you achieve your business objectives. We're excited to partner with you and deliver exceptional results.",
                }),
                i.jsx("div", {
                  className: "col-10 social panContainer  mt-0 pt-0",
                  id: "contact",
                  style: { minHeight: "100px", height: "100px" },
                  children:
                    e.vh - e.sh > -50 &&
                    i.jsxs("div", {
                      children: [
                        i.jsx(ve, {
                          inline: !0,
                          delay: 500,
                          children: i.jsx("a", {
                            target: "_blank",
                            className: "shadow hovShade me-2 slideIn panel",
                            href: "https://github.com/Msugh623",
                            children: i.jsxs("span", {
                              className: "bi bi-twitter ",
                              children: [
                                " ",
                                i.jsx(co, { className: "icon fs-4" }),
                                i.jsx("div", {
                                  className: "text",
                                  children: "Github",
                                }),
                              ],
                            }),
                          }),
                        }),
                        i.jsx(ve, {
                          inline: !0,
                          delay: 800,
                          children: i.jsx("a", {
                            target: "_blank",
                            className: "shadow hovShade me-2 slideRight panel",
                            href: "mailto:iternenge469@gmail.com",
                            children: i.jsxs("span", {
                              className: "bi bi-twitter",
                              children: [
                                " ",
                                i.jsx(Li, { className: "icon fs-4" }),
                                i.jsx("div", {
                                  className: "text",
                                  children: "Email",
                                }),
                              ],
                            }),
                          }),
                        }),
                        i.jsx(ve, {
                          inline: !0,
                          delay: 900,
                          children: i.jsx("a", {
                            target: "_blank",
                            className: "shadow hovShade me-2 slideRight panel",
                            href: "https://wa.me/2348121667177",
                            children: i.jsxs("span", {
                              className: "bi bi-facebook",
                              children: [
                                " ",
                                i.jsx(uo, { className: "icon fs-4" }),
                                i.jsx("div", {
                                  className: "text",
                                  children: "Whatsapp",
                                }),
                              ],
                            }),
                          }),
                        }),
                        i.jsx(ve, {
                          inline: !0,
                          delay: 1e3,
                          children: i.jsx("a", {
                            target: "_blank",
                            className: "shadow hovShade me-2 slideRight panel",
                            href: "https://ng.linkedin.com/in/chia-ernest-b923962a9",
                            children: i.jsxs("span", {
                              className: "bi bi-instagram",
                              children: [
                                i.jsx(lo, { className: "fs-4 icon" }),
                                i.jsx("div", {
                                  className: "text",
                                  children: "Linkedin",
                                }),
                              ],
                            }),
                          }),
                        }),
                      ],
                    }),
                }),
              ],
            }),
          }),
        ],
      })
    );
  },
  Bm = () =>
    i.jsxs("section", {
      id: "contact",
      className: "contact section pt-0 darkTheme  m-0 h-100",
      style: { minHeight: "100vh" },
      children: [
        i.jsx("div", {
          className: "container section-title pt-4 growIn",
          "data-aos": "fade-up",
          children: i.jsxs("div", {
            className: "",
            children: [
              i.jsx("h2", {
                className: "mb-0 slideUp d-flex",
                children: i.jsxs("div", {
                  className: "mx-auto row",
                  children: [
                    i.jsx("div", {
                      className: "col-md-5",
                      children: i.jsx(Ne.LazyLoadImage, {
                        effect: "opacity",
                        placeholder: i.jsx(Ee, {}),
                        src: "https://res.cloudinary.com/dqbgai7xd/image/upload/v1736547841/IMG_20250108_220759_005_wuzxgh.webp",
                        height: "250px",
                        alt: "",
                        className: "icon rounded slideUp",
                      }),
                    }),
                    i.jsx(ve, {
                      delay: 600,
                      children: i.jsx("div", {
                        className: "my-auto col-md-1 px-md-5 slideRight",
                        children: i.jsx(Ud, { className: "fs-1" }),
                      }),
                    }),
                    i.jsx(ve, {
                      delay: 800,
                      children: i.jsx("div", {
                        className: "my-auto col-md-5",
                        children: i.jsx(xe, {
                          to: "/",
                          children: i.jsx(Ne.LazyLoadImage, {
                            effect: "opacity",
                            placeholder: i.jsx(Ee, {}),
                            src: "/sprintetName.png",
                            height: "120px",
                            alt: "",
                            className: "icon slideRight",
                          }),
                        }),
                      }),
                    }),
                  ],
                }),
              }),
              i.jsx(ve, {
                delay: 1e3,
                children: i.jsx("div", {
                  className: "mb-3 mt-md-5 slideUp",
                  children:
                    "Hey, I'm Chia Ernest, a skilled programmer and the founder of Sprintet. At Sprintet, we're dedicated to transforming innovative ideas into powerful tech solutions. I'm passionate about tackling complex problems and delivering creative, high-impact results. Whether it's building sophisticated web apps or designing robust software, I'm always ready for the next challenge. Let's work together and make something amazing.",
                }),
              }),
              i.jsx(ve, {
                delay: 1300,
                children: i.jsx("div", {
                  className: "mb-3 slideUp",
                  children:
                    "Ready to bring your vision to life? Whether you have a project in mind or just want to discuss ideas, I'm here to help. Drop me a message, and let's create something amazing together!",
                }),
              }),
            ],
          }),
        }),
        i.jsx("div", {
          className: "container section-title d-flex",
          "data-aos": "fade",
          "data-aos-delay": "100",
          children: i.jsxs("div", {
            className:
              "col-10 social mx-auto text-sm-center panContainer  mt-0 pt-0",
            children: [
              i.jsx(ve, {
                inline: !0,
                delay: 1500,
                children: i.jsx("a", {
                  target: "_blank",
                  className: "shadow panel hovShade me-2 slideIn",
                  href: "https://github.com/Msugh623",
                  children: i.jsxs("span", {
                    className: "bi bi-twitter ",
                    children: [
                      " ",
                      i.jsx(co, { className: "icon fs-4" }),
                      i.jsx("div", { className: "text", children: "Github" }),
                    ],
                  }),
                }),
              }),
              i.jsx(ve, {
                inline: !0,
                delay: 2e3,
                children: i.jsx("a", {
                  target: "_blank",
                  className: "shadow panel hovShade me-2 slideRight",
                  href: "mailto:iternenge469@gmail.com",
                  children: i.jsxs("span", {
                    className: "bi bi-twitter",
                    children: [
                      " ",
                      i.jsx(Li, { className: "icon fs-4" }),
                      i.jsx("div", { className: "text", children: "Email" }),
                    ],
                  }),
                }),
              }),
              i.jsx(ve, {
                inline: !0,
                delay: 2100,
                children: i.jsx("a", {
                  target: "_blank",
                  className: "shadow panel hovShade me-2 slideRight",
                  href: "https://wa.me/2348121667177",
                  children: i.jsxs("span", {
                    className: "bi bi-facebook",
                    children: [
                      " ",
                      i.jsx(uo, { className: "icon fs-4" }),
                      i.jsx("div", { className: "text", children: "Whatsapp" }),
                    ],
                  }),
                }),
              }),
              i.jsx(ve, {
                inline: !0,
                delay: 2200,
                children: i.jsx("a", {
                  target: "_blank",
                  className: "shadow panel hovShade me-2 slideRight",
                  href: "https://ng.linkedin.com/in/chia-ernest-b923962a9",
                  children: i.jsxs("span", {
                    className: "bi bi-instagram",
                    children: [
                      i.jsx(lo, { className: "fs-4 icon" }),
                      i.jsx("div", { className: "text", children: "Linkedin" }),
                    ],
                  }),
                }),
              }),
            ],
          }),
        }),
      ],
    }),
  lr = ({ children: e, sudo: t }) => {
    const n = Re(),
      r = We(),
      [s, a] = y.useState(!1);
    return (
      y.useEffect(() => {
        t
          ? localStorage.access
            ? a(!0)
            : ((localStorage.go = location.pathname),
              P("Remote input requires administrator access"),
              n("/login", { replace: !0 }))
          : a(!0);
      }, [r]),
      i.jsxs(i.Fragment, { children: [s && i.jsx(Jr, {}), s && e] })
    );
  };
let Sa = class {
  constructor(t) {
    (this.name = t.name || ""),
      (this.icon = t.icon || ""),
      (this.about = t.about || ""),
      (this.location = t.location || ""),
      (this.pinned = t.pinned || ""),
      (this.category = t.category || ""),
      (this.id = "app" + Date.now());
  }
};
const ja = () => {
    const { fetchSrc: e } = _e(),
      t = Re(),
      [n, r] = y.useState({ ...new Sa({}) });
    function s({ target: o }) {
      const { name: c, value: l } = o;
      r((u) => ({ ...u, [c]: l }));
    }
    async function a(o) {
      var l;
      o.preventDefault();
      const c = P("Please Wait...", {
        autoClose: !1,
        icon: i.jsx(Ca, { className: "spinner icon" }),
      });
      try {
        const u = { ...new Sa(n) },
          d = await le.post("/rq/apps", u);
        t("/admin", { replace: !0 });
      } catch (u) {
        P.error(
          i.jsx("div", {
            dangerouslySetInnerHTML: {
              __html: `${
                ((l = u == null ? void 0 : u.response) == null
                  ? void 0
                  : l.data) ||
                u.message ||
                "" + u
              }`,
            },
          })
        );
      } finally {
        P.dismiss(c);
      }
    }
    return (
      y.useEffect(() => {
        e();
      }, []),
      i.jsxs("section", {
        id: "contact",
        className: "contact section pt-1  darkTheme",
        children: [
          i.jsx("div", {
            className: "container section-title py-4 growIn",
            "data-aos": "fade-up",
            children: i.jsx("h2", { children: "Add App" }),
          }),
          i.jsx("div", {
            className: "container slideUp",
            "data-aos": "fade",
            "data-aos-delay": "100",
            children: i.jsx("div", {
              className: "row ",
              children: i.jsx("div", {
                className: "col-md-8 mx-auto",
                children: i.jsx("form", {
                  onSubmit: a,
                  className: "php-email-form",
                  "data-aos": "fade-up",
                  "data-aos-delay": "200",
                  children: i.jsxs("div", {
                    className: "row gy-4",
                    children: [
                      i.jsx("div", {
                        className: "col-md-12",
                        children: i.jsx("input", {
                          type: "text",
                          name: "name",
                          value: n.name,
                          onChange: s,
                          className: "form-control shadow-sm ",
                          placeholder: "Creation Name",
                          required: !0,
                        }),
                      }),
                      i.jsx("div", {
                        className: "col-md-12",
                        children: i.jsx("input", {
                          type: "text",
                          name: "icon",
                          value: n.icon,
                          onChange: s,
                          className: "form-control shadow-sm ",
                          placeholder: "App Icon",
                          required: !0,
                        }),
                      }),
                      i.jsx("div", {
                        className: "col-md-12",
                        children: i.jsx("input", {
                          type: "text",
                          name: "category",
                          value: n.category,
                          onChange: s,
                          className: "form-control shadow-sm ",
                          placeholder: "App Category",
                          required: !0,
                        }),
                      }),
                      i.jsx("div", {
                        className: "col-md-12",
                        children: i.jsx("input", {
                          type: "text",
                          name: "location",
                          value: n.location,
                          onChange: s,
                          className: "form-control shadow-sm",
                          placeholder: "Web URL",
                          required: !0,
                        }),
                      }),
                      i.jsx("div", {
                        className: "col-md-12",
                        children: i.jsxs("div", {
                          className: "panel",
                          children: [
                            i.jsx("label", {
                              className: "px-2",
                              children: "Is Pinned",
                            }),
                            i.jsx("hr", { className: "m-0" }),
                            i.jsxs("select", {
                              type: "text",
                              name: "pinned",
                              value: n.pinned,
                              onChange: s,
                              className: "form-control shadow-sm",
                              children: [
                                i.jsx("option", {
                                  value: "",
                                  children: "false",
                                }),
                                i.jsx("option", {
                                  value: !0,
                                  children: "true",
                                }),
                              ],
                            }),
                          ],
                        }),
                      }),
                      i.jsx("div", {
                        className: "col-md-12",
                        children: i.jsx("textarea", {
                          className: "form-control shadow-sm",
                          name: "about",
                          value: n.about,
                          onChange: s,
                          rows: "6",
                          placeholder: "Description",
                          required: !0,
                        }),
                      }),
                      i.jsx("div", {
                        className: "col-md-12 text-center",
                        children: i.jsx("button", {
                          type: "submit",
                          children: "Add Creation",
                        }),
                      }),
                    ],
                  }),
                }),
              }),
            }),
          }),
        ],
      })
    );
  },
  Fm = () => {
    const { apps: e, fetchSrc: t, categories: n, hostname: r } = _e(),
      [s, a] = y.useState(e),
      [o, c] = y.useState("All");
    return (
      y.useEffect(() => {
        o == "All" ? a(e) : a(e.filter((l) => l.category == o));
      }, [o, e]),
      y.useEffect(() => {
        (document.title = "Sprintet Fsdiscover  - " + r), t();
      }, []),
      i.jsx("main", {
        id: "main",
        children: i.jsx("section", {
          className: "section site-portfolio py-5 darkTheme",
          children: i.jsxs("div", {
            className: "container",
            children: [
              i.jsxs("div", {
                className: "row mb-5",
                children: [
                  i.jsxs("div", {
                    className:
                      "d-flex flex-column flex-md-row slideIn mb-4 mb-lg-0",
                    "data-aos": "fade-up",
                    children: [
                      i.jsx("h2", {
                        className: "",
                        children: i.jsxs(xe, {
                          to: "/",
                          children: [
                            i.jsx("diviDotsNineBold", {
                              style: { fontSize: "2em", color: "steelblue" },
                              className: "text-primary icon",
                            }),
                            i.jsx(Ne.LazyLoadImage, {
                              effect: "opacity",
                              placeholder: i.jsx(Ee, {}),
                              src: "/sprintetName.png",
                              height: "100px",
                              alt: "",
                            }),
                          ],
                        }),
                      }),
                      i.jsxs("div", {
                        className: "ms-0 ms-md-auto",
                        children: [
                          i.jsx("div", {
                            className: "d-flex pb-2",
                            children: i.jsx(xe, {
                              to: localStorage.access ? "/admin" : "/login",
                              className:
                                "rounded shadow-lg p-3 ms-auto py-2 border border-dashed readmore custom-navmenu text-light",
                              children: i.jsx(Fd, { className: "fs-4" }),
                            }),
                          }),
                          "Device Hostname: " + r,
                        ],
                      }),
                    ],
                  }),
                  i.jsx("div", {
                    className: "text-start text-lg-end mt-3",
                    "data-aos": "fade-up",
                    "data-aos-delay": "100",
                    children: i.jsxs("div", {
                      id: "categories",
                      className: "ms-auto py-2 categories d-flex slideLeft",
                      style: { maxWidth: "98vw", overflow: "auto" },
                      children: [
                        i.jsxs("a", {
                          href: "#All",
                          "data-category": "*",
                          className:
                            "p-1 mx-1 shadow rounded" +
                            (o == "All" && "active rounded border"),
                          onClick: () => c("All"),
                          children: ["All", " "],
                        }),
                        n.map((l) =>
                          i.jsx("a", {
                            href: `#${l}`,
                            "data-category": "*",
                            className:
                              "p-1 border-bottom mx-1 shadow rounded me-1" +
                              (o == l && "active border "),
                            onClick: () => c("" + l),
                            children: l,
                          })
                        ),
                      ],
                    }),
                  }),
                ],
              }),
              i.jsx("div", {
                id: "portfolio-grid",
                className: "row",
                "data-aos": "fade-up",
                "data-aos-delay": "200",
                children: s.map((l) => i.jsx(Hm, { app: l }, l.id)),
              }),
            ],
          }),
        }),
      })
    );
  },
  Hm = ({ app: e }) => {
    const t = Re();
    return i.jsx("div", {
      className: "col-6 col-md-4 col-lg-3 py-3",
      children: i.jsx("div", {
        onClick: () =>
          e.location.includes("http")
            ? (location.href = e.location)
            : t(e.location),
        children: i.jsxs("div", {
          className: "p-2 active rounded fadeIn",
          children: [
            (e == null ? void 0 : e.pinned) &&
              i.jsx("div", {
                className: "d-flex",
                style: { position: "absolute" },
                children: i.jsx("div", {
                  className: "p-1 btn btn-primary shadow rounded",
                }),
              }),
            i.jsxs("div", {
              className: "row",
              style: { minHeight: "90px" },
              children: [
                i.jsx("div", {
                  className: "col-sm-5 my-auto",
                  children: i.jsx(Ne.LazyLoadImage, {
                    effect: "opacity",
                    placeholder: i.jsx(Ee, {}),
                    src: e.icon,
                    className: "my-auto img-fluid rounded",
                    alt: "",
                  }),
                }),
                i.jsxs("div", {
                  className: "col-sm-7",
                  children: [
                    i.jsx("h4", {
                      className: "text-ligt mb-1",
                      children: e == null ? void 0 : e.name,
                    }),
                    i.jsx("div", { children: e == null ? void 0 : e.category }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
    });
  },
  Um = () => {
    const e = Re(),
      [t, n] = y.useState({ email: "", password: "" }),
      r = ({ target: a }) => {
        n((o) => ({ ...o, [a.name]: a.value }));
      },
      s = async (a) => {
        var c, l;
        a.preventDefault();
        const o = P("logging in...", { autoClose: !1 });
        try {
          const u =
            (c = await le.post("/rq/login", t)) == null ? void 0 : c.data;
          (localStorage.access = u.token),
            (le.defaults.headers.common.Authorization = u.token);
          const d = localStorage.go;
          (localStorage.go = ""), d ? e(d) : location.replace("/");
        } catch (u) {
          P.error(
            i.jsx("div", {
              dangerouslySetInnerHTML: {
                __html: `${
                  ((l = u == null ? void 0 : u.response) == null
                    ? void 0
                    : l.data) ||
                  u.message ||
                  "" + u
                }`,
              },
            })
          );
        } finally {
          P.dismiss(o);
        }
      };
    return i.jsx("div", {
      className: "container pt-5 darkTheme",
      children: i.jsx("div", {
        className: "row",
        children: i.jsxs("form", {
          onSubmit: s,
          className:
            "col-10 col-sm-9 col-md-7 col-lg-5 shadow-md panel rounded mx-auto slideUp",
          children: [
            i.jsx("div", {
              className: "d-flex",
              children: i.jsx("h3", {
                className: "m-auto my-3",
                children: i.jsxs(xe, {
                  to: "/",
                  children: [
                    i.jsx(Ne.LazyLoadImage, {
                      effect: "opacity",
                      placeholder: i.jsx(Ee, {}),
                      src: "sprintetName.png",
                      height: "60px",
                      alt: "",
                    }),
                    " ",
                    "Login",
                  ],
                }),
              }),
            }),
            i.jsx("div", {
              className: "form-group mb-3",
              children: i.jsx("input", {
                type: "email",
                className: "form-control border",
                name: "email",
                onChange: r,
                value: t.email,
                required: !0,
                placeholder: "Email",
              }),
            }),
            i.jsx("div", {
              className: "form-group",
              children: i.jsx("input", {
                type: "password",
                name: "password",
                className: "form-control border",
                onChange: r,
                value: t.password,
                required: !0,
                placeholder: "Password",
              }),
            }),
            i.jsx("button", {
              className: "readmore custom-navmenu text-light growIn my-3",
              children: "Login",
            }),
          ],
        }),
      }),
    });
  },
  zm = () => i.jsx("div", { children: i.jsx(Jr, {}) }),
  wo = y.createContext(),
  $m = ({ children: e }) => {
    const t = We(),
      [n, r] = y.useState(""),
      [s, a] = y.useState([]),
      [o, c] = y.useState(!1),
      [l, u] = y.useState(!1),
      [d, h] = y.useState(""),
      [p, x] = y.useState(""),
      [v, g] = y.useState(""),
      [m, w] = y.useState("");
    async function T(N = n) {
      var _, O;
      c(!0), x("");
      try {
        const j = await le.get("/fs" + N);
        a(j.data);
      } catch (j) {
        P.error(
          i.jsx("div", {
            dangerouslySetInnerHTML: {
              __html: `${
                ((_ = j == null ? void 0 : j.response) == null
                  ? void 0
                  : _.data) ||
                j.message ||
                "" + j
              }`,
            },
          })
        ),
          x(
            "" + (j == null ? void 0 : j.status) == "404"
              ? "No such file or directory"
              : ((O = j == null ? void 0 : j.response) == null
                  ? void 0
                  : O.data) ||
                  j.message ||
                  "" + j
          );
      } finally {
        c(!1);
      }
    }
    return (
      y.useEffect(() => {
        const N = t.pathname.replace("/fsexplorer", "");
        a([]), r(N), T(N);
      }, [t]),
      i.jsx(wo.Provider, {
        value: {
          locChildren: s,
          locPath: n,
          getFs: T,
          isFetching: o,
          setIsFetching: c,
          isHidden: l,
          setIsHidden: u,
          key: d,
          setKey: h,
          err: p,
          modal: m,
          setModal: w,
          title: v,
          setTitle: g,
        },
        children: e,
      })
    );
  },
  Fn = () => y.useContext(wo),
  Wm = ({ data: e }) =>
    i.jsxs(xe, {
      to: location.pathname + "/" + (e == null ? void 0 : e.name),
      className: "text-light",
      children: [
        i.jsx(Rf, { className: "icon" }),
        " ",
        i.jsx("span", {
          className: "text-truncate",
          children: e == null ? void 0 : e.name,
        }),
      ],
    }),
  Vm = ({ data: e }) => {
    const t = window.innerWidth < 468 ? 10 : 30,
      n = e == null ? void 0 : e.name.substring(0, t - 5);
    return i.jsxs("a", {
      className: "text-light",
      style: { maxWidth: "100%" },
      href: location.pathname + "/" + (e == null ? void 0 : e.name),
      children: [
        i.jsx(Ld, {}),
        " ",
        i.jsx("span", {
          className: "text-truncate",
          children:
            (e == null ? void 0 : e.name.length) > t
              ? n +
                "..." +
                e.name.substring(
                  (e == null ? void 0 : e.name.length) - 8,
                  e == null ? void 0 : e.name.length
                )
              : e == null
              ? void 0
              : e.name,
        }),
      ],
    });
  },
  qm = ({ item: e }) => {
    const { key: t, getFs: n } = Fn(),
      { forbidroute: r } = _e(),
      s = e.includes(".") ? "file" : "folder",
      a = e.slice(e.lastIndexOf(".") + 1) || "",
      o = e,
      c = s == "file" ? a.toUpperCase() + " file" : "Folder",
      l = location.pathname.replace("/fsexplorer", "fs") + "/" + e,
      u = {
        type: s,
        name: o,
        detailedType: c,
        extension: a,
        size: 0,
        createdAt: "",
        modifiedAt: "",
        url: l,
      },
      [d, h] = y.useState({ x: 0, y: 0 }),
      [p, x] = y.useState(!1),
      v = i.jsxs("div", {
        className: " p-1 small themebg rounded inner",
        onClick: () => {
          x(!1);
        },
        style: { position: "relative" },
        children: [
          s == "file"
            ? i.jsxs("div", {
                className: "p-1 rounded active",
                title: "Download File",
                style: { cursor: "pointer" },
                onClick: () => {
                  const g = document.createElement("a");
                  (g.href =
                    location.pathname + "/" + (u == null ? void 0 : u.name)),
                    (g.download = u.name),
                    g.click();
                },
                children: [i.jsx(Of, { className: "icon" }), " Download File"],
              })
            : i.jsxs("div", {
                className: "p-1 rounded active",
                title: "Download as compressed ZIP",
                style: { cursor: "pointer" },
                onClick: () => {
                  const g = document.createElement("a");
                  (g.href = location.href.replace("/fsexplorer", "/zipper")),
                    (g.download = u.name),
                    g.click();
                },
                children: [i.jsx(kf, { className: "icon" }), " Download ZIP"],
              }),
          localStorage.access &&
            i.jsxs("div", {
              className: "p-1 mt-1 rounded active",
              title: "Download as compressed ZIP",
              style: { cursor: "pointer" },
              onClick: () => {
                const g = location.pathname.replace("/fsexplorer", "");
                r(l.replace("fs/", "")), n(g);
              },
              children: [i.jsx(Bd, { className: "icon" }), " Protect Route"],
            }),
        ],
      });
    return o.toLowerCase().includes(t.toLowerCase()) ||
      t.toLowerCase().includes(o.toLowerCase())
      ? i.jsxs("div", {
          className: "fs-5 my-1 d-flex active p-2",
          children: [
            s == "folder" ? i.jsx(Wm, { data: u }) : i.jsx(Vm, { data: u }),
            i.jsxs("div", {
              className: "ms-auto",
              children: [
                i.jsx("div", {
                  children: i.jsx("div", {
                    className: "pe-2",
                    title: "Download File",
                    style: { cursor: "pointer" },
                    onClick: (g) => {
                      x((m) => !m), h({ x: g.clientX, y: g.clientY });
                    },
                    children: i.jsx(Af, { className: "icon" }),
                  }),
                }),
                p &&
                  i.jsxs(i.Fragment, {
                    children: [
                      i.jsx("div", {
                        className: "",
                        onClick: (g) => {
                          g.stopPropagation(), x(!1);
                        },
                        style: {
                          position: "fixed",
                          top: "0px",
                          bottom: "0px",
                          left: "0px",
                          right: "0px",
                          zIndex: "5",
                        },
                      }),
                      i.jsx("div", {
                        className: "themebg small rounded",
                        style: {
                          width: "150px",
                          position: "fixed",
                          top: d.y + "px",
                          left: d.x - 150 + "px",
                          zIndex: 6,
                        },
                        children: i.jsx("div", {
                          className: "active rounded p-1",
                          children: v,
                        }),
                      }),
                    ],
                  }),
              ],
            }),
          ],
        })
      : !1;
  },
  Ym = () => {
    const { setIsHidden: e, getFs: t, isHidden: n, key: r, setKey: s } = Fn(),
      { hostname: a } = _e(),
      o = Re(),
      [c, l] = y.useState(0),
      [u, d] = y.useState(!1),
      [h, p] = y.useState([]),
      [x, v] = y.useState(window.innerWidth > 1280),
      g = async (m) => {
        var w;
        if (h.length > 0 || (m || []).length > 0) {
          d(!0);
          const T = new FormData();
          for (const N of m || h) T.append("files", N);
          T.append("dir", location.pathname.replace("/fsexplorer", ""));
          try {
            const N = await le.post("/fs/upload", T, {
              onUploadProgress: (_) => {
                const { loaded: O, total: j } = _,
                  f = Math.floor((O * 100) / j);
                l(f);
              },
              headers: { "Content-Type": "multipart/form-data" },
            });
            P.success(N.data), p([]), setTimeout(() => t(), 800);
          } catch (N) {
            P.error(
              i.jsx("div", {
                dangerouslySetInnerHTML: {
                  __html: `${
                    ((w = N == null ? void 0 : N.response) == null
                      ? void 0
                      : w.data) ||
                    N.message ||
                    "" + N
                  }`,
                },
              })
            );
          } finally {
            d(!1);
          }
        }
      };
    return i.jsxs(i.Fragment, {
      children: [
        i.jsxs("nav", {
          className:
            "navbar flex-column gap-2 navbar-expand-lg mb-0 navbar-dark themebg ani slideIn shadow-sm",
          style: { position: "sticky", top: 0, zIndex: 1 },
          children: [
            i.jsxs("div", {
              className: "w-100 nav",
              children: [
                n &&
                  !x &&
                  window.innerWidth < 400 &&
                  i.jsxs("h2", {
                    className:
                      "h4 mt-auto slideUp mx-4 ms-4  pb-2 mb-4 border-bottom d-flex",
                    children: [
                      i.jsx(xe, {
                        to: "/",
                        className: "text-light mt-auto  fw-bold fs-5",
                        children: a,
                      }),
                      i.jsx("div", {
                        className: "mt-auto ms-2",
                        children: " - File Manager",
                      }),
                    ],
                  }),
                window.innerWidth < 400 &&
                  i.jsxs(i.Fragment, {
                    children: [
                      i.jsxs("div", {
                        className:
                          "ms-auto w-auto d-flex my-auto  p-1 form-group border rounded me-2",
                        style: { maxWidth: "98vw" },
                        children: [
                          x &&
                            i.jsx("input", {
                              type: "search",
                              autoFocus: !0,
                              value: r,
                              className:
                                "rounded input px-1 no-dec bg-none themebg",
                              onChange: ({ target: m }) => s(m.value),
                              style: { border: "none", outline: "none" },
                            }),
                          i.jsx("button", {
                            className:
                              "themebg border-0 border-start px-2 border my-auto text-light",
                            onClick: () => {
                              v((m) => !m), s("");
                            },
                            children: i.jsx(sa, {}),
                          }),
                        ],
                      }),
                      i.jsx("div", { className: "me-1" }),
                    ],
                  }),
              ],
            }),
            i.jsx("div", {
              className: "container-fluid",
              children: i.jsxs("div", {
                className: "w-100 d-flex ",
                id: "navbarNav",
                children: [
                  i.jsx("a", {
                    className: "nav-link my-auto fs-3 border-end px-2 pe-3",
                    onClick: () => o(-1),
                    children: i.jsx(Id, { className: "icon" }),
                  }),
                  i.jsxs("a", {
                    className: "nav-link my-auto ms-2 p-2",
                    style: { cursor: "pointer" },
                    onClick: () => {
                      h.length
                        ? confirm(
                            `Press "Okay" to upload ${h.length} files to ${a}'s computer!`
                          )
                          ? g()
                          : P(
                              "Operation requires user permission which has been denied"
                            )
                        : document.getElementById("filer").click();
                    },
                    children: [
                      i.jsx(Df, { className: "icon" }),
                      " ",
                      window.innerWidth > 600 || !h.length ? "Upload" : "",
                      " ",
                      h.length ? h.length + " files" : "",
                      h != null && h.length
                        ? i.jsx("span", {
                            title: "Change selection",
                            onClick: (m) => {
                              m.stopPropagation(),
                                document.getElementById("filer").click();
                            },
                            className: "rounded ms-2",
                            children: i.jsx(zd, { className: "icon fs-4" }),
                          })
                        : "",
                      h != null && h.length
                        ? i.jsx("span", {
                            title: "Cancel Selection",
                            onClick: (m) => {
                              m.stopPropagation(),
                                confirm(
                                  "Do you want to Unselect all selected Files?"
                                ) && p([]);
                            },
                            className: " rounded fs-5 ms-2",
                            children: i.jsx(Oa, { className: "icon" }),
                          })
                        : "",
                    ],
                  }),
                  i.jsx("input", {
                    type: "file",
                    name: "files",
                    id: "filer",
                    multiple: !0,
                    style: { opacity: "0", width: "0px", height: "0px" },
                    onChange: ({ target: m }) => {
                      p(m.files),
                        confirm(
                          `Press "Okay" to upload ${m.files.length} files to ${a}`
                        )
                          ? g(m.files)
                          : P(
                              "Operation requires user permission which has been denied"
                            );
                    },
                  }),
                  i.jsxs("div", {
                    className: "d-flex ms-auto",
                    children: [
                      window.innerWidth >= 400 &&
                        i.jsxs("div", {
                          className:
                            "d-flex p-1 form-group border rounded me-2",
                          children: [
                            x &&
                              i.jsx("input", {
                                autoFocus: !0,
                                type: "search",
                                value: r,
                                className:
                                  "rounded input px-1 no-dec bg-none themebg",
                                onChange: ({ target: m }) => s(m.value),
                                style: { border: "none", outline: "none" },
                              }),
                            i.jsx("button", {
                              className:
                                "themebg border-0 border-start px-2 border text-light",
                              onClick: () => {
                                v((m) => !m), s("");
                              },
                              children: i.jsx(sa, {}),
                            }),
                          ],
                        }),
                      i.jsx("button", {
                        className: "btn btn-outline-light",
                        type: "submit",
                        onClick: () => e((m) => !m),
                        children: i.jsx(Cf, { className: "icon" }),
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
        u &&
          i.jsx("progress", {
            className: "w-100 mt-0",
            style: { position: "relative", bottom: "5px" },
            value: c,
            max: 100,
          }),
      ],
    });
  },
  Xm = () => {
    const { isHidden: e } = Fn(),
      { hostname: t } = _e(),
      n = Re();
    return i.jsxs("div", {
      className: `sidebar themebg text-light ${
        e ? "d-none" : "d-block"
      } shadow`,
      style: {
        width: "250px",
        height: "100vh",
        padding: "20px",
        position: "sticky",
        top: "0",
      },
      children: [
        i.jsxs("h2", {
          className: "h4 pb-2 mb-4 slideIn border-bottom",
          children: [
            i.jsx(xe, {
              to: "/",
              className: "text-light fw-bold fs-5",
              children: t,
            }),
            " ",
            i.jsx("br", {}),
            i.jsx("div", { className: "mt-2", children: "File Manager" }),
          ],
        }),
        i.jsxs("ul", {
          className: "list-unstyled",
          children: [
            i.jsx("li", {
              className: "mb-3",
              children: i.jsx("button", {
                className: "btn text-light w-100 text-start",
                type: "button",
                onClick: () => n("/fsexplorer"),
                children: "Home",
              }),
            }),
            i.jsx("li", {
              className: "mb-3",
              children: i.jsx("button", {
                className: "btn text-light w-100 text-start",
                type: "button",
                onClick: () => n("/fsexplorer/Documents"),
                children: "Documents",
              }),
            }),
            i.jsx("li", {
              className: "mb-3",
              children: i.jsx("button", {
                className: "btn text-light w-100 text-start",
                type: "button",
                onClick: () => n("/fsexplorer/Downloads"),
                children: "Downloads",
              }),
            }),
            i.jsx("li", {
              className: "mb-3",
              children: i.jsx("button", {
                className: "btn text-light w-100 text-start",
                type: "button",
                onClick: () => n("/fsexplorer/Pictures"),
                children: "Pictures",
              }),
            }),
            i.jsx("li", {
              className: "mb-3",
              children: i.jsx("button", {
                className: "btn text-light w-100 text-start",
                type: "button",
                onClick: () => n("/fsexplorer/Videos"),
                children: "Videos",
              }),
            }),
            i.jsx("li", {
              className: "mb-3",
              children: i.jsx("button", {
                className: "btn text-light w-100 text-start",
                type: "button",
                onClick: () => n("/fsexplorer/Music"),
                children: "Music",
              }),
            }),
          ],
        }),
      ],
    });
  },
  _a = () => {
    const {
        isFetching: e,
        locChildren: t,
        isHidden: n,
        setIsHidden: r,
        err: s,
        key: a,
        setKey: o,
        modal: c,
        setModal: l,
        title: u,
      } = Fn(),
      { hostname: d } = _e(),
      h = We();
    return (
      y.useEffect(() => {
        window.innerWidth < 768 ? r(!0) : r(!1),
          (document.title =
            "" +
            d +
            " - File System: " +
            (h.pathname.replace("/fsexplorer", "") || "/")),
          a && o("");
      }, [window.innerWidth, h.pathname]),
      i.jsxs("div", {
        style: { minWidth: "300px" },
        children: [
          i.jsxs("div", {
            className: "d-flex w-100",
            children: [
              n ? !1 : i.jsx(Xm, {}),
              i.jsxs("div", {
                className: "w-100 bg-dark",
                style: {
                  minWidth: window.innerWidth < 500 && !n ? "100vw" : "",
                },
                children: [
                  i.jsx(Ym, {}),
                  i.jsxs("div", {
                    className: "p-2 px-4 pb-0",
                    children: [
                      h.pathname.replace("/fsexplorer", "") ? "Home > " : "",
                      h.pathname
                        .replace("/fsexplorer", "")
                        .replaceAll("%20", " ")
                        .slice(1)
                        .replaceAll("/", " > ") || "Home",
                    ],
                  }),
                  i.jsxs("div", {
                    className: "p-4 pt-3 w-100",
                    style: { maxWidth: "100%" },
                    children: [
                      e && !t.length
                        ? i.jsx("div", {
                            className: "fs-4 text-center",
                            style: {
                              position: "fixed",
                              bottom: "10px",
                              right: "10px",
                            },
                            children: i.jsx(Ca, { className: "spinner" }),
                          })
                        : "",
                      !e && !t.length
                        ? i.jsx("div", {
                            className: "fs-4 text-center mt-5",
                            dangerouslySetInnerHTML: {
                              __html: s || "Empty Directory",
                            },
                            style: {},
                          })
                        : "",
                      t.map((p, x) => i.jsx(qm, { item: p }, "" + p + x)),
                      i.jsx("div", { className: "my-3" }),
                      t.length
                        ? i.jsxs(i.Fragment, { children: [t.length, " Items"] })
                        : "",
                    ],
                  }),
                ],
              }),
            ],
          }),
          c &&
            i.jsx(i.Fragment, {
              children: i.jsx("div", {
                className: "d-flex",
                style: {
                  position: "fixed",
                  top: "0px",
                  bottom: "0px",
                  left: "0px",
                  right: "0px",
                  background: "#0e0e030",
                  zIndex: "10",
                },
                children: i.jsxs("div", {
                  className: "m-auto p-1 active",
                  children: [
                    i.jsxs("div", {
                      className: "d-flex fw-bold",
                      children: [
                        u,
                        i.jsx("div", {
                          className: "ms-auto rounded themebg fs-5",
                          onClick: () => l(""),
                          children: i.jsx(Oa, { className: "icon" }),
                        }),
                      ],
                    }),
                    i.jsx("div", { className: "themebg round", children: c }),
                  ],
                }),
              }),
            }),
        ],
      })
    );
  },
  Jm = () => {
    const {
        fetchConfig: e,
        visitors: t,
        forbidden: n,
        setForbidden: r,
        protectedRoutes: s,
        setProtectedRoutes: a,
        hostname: o,
        changePass: c,
        devices: l,
        setDevices: u,
        traffic: d,
        setTraffic: h,
        scrollConfig: p,
        setScrollConfig: x,
      } = _e(),
      v = Re(),
      [g, m] = y.useState("Visitors");
    async function w(f) {
      var E;
      try {
        const S = await le.put("/admin/rq/forbidden", f);
        r(S.data);
      } catch (S) {
        P.error(
          i.jsx("div", {
            dangerouslySetInnerHTML: {
              __html: `${
                ((E = S == null ? void 0 : S.response) == null
                  ? void 0
                  : E.data) ||
                S.message ||
                "" + S
              }`,
            },
          })
        );
      }
    }
    async function T(f) {
      var E;
      try {
        const S = await le.post("/admin/rq/devices/rem", f);
        u(S.data);
      } catch (S) {
        P.error(
          i.jsx("div", {
            dangerouslySetInnerHTML: {
              __html: `${
                ((E = S == null ? void 0 : S.response) == null
                  ? void 0
                  : E.data) ||
                S.message ||
                "" + S
              }`,
            },
          })
        );
      }
    }
    async function N(f) {
      var E;
      try {
        const S = await le.post("/admin/rq/forbidden/pardon", f);
        r(S.data);
      } catch (S) {
        P.error(
          i.jsx("div", {
            dangerouslySetInnerHTML: {
              __html: `${
                ((E = S == null ? void 0 : S.response) == null
                  ? void 0
                  : E.data) ||
                S.message ||
                "" + S
              }`,
            },
          })
        );
      }
    }
    async function _(f) {
      var E;
      try {
        const S = await le.put("/admin/rq/protectedroutes", { route: f });
        a(S.data);
      } catch (S) {
        P.error(
          i.jsx("div", {
            dangerouslySetInnerHTML: {
              __html: `${
                ((E = S == null ? void 0 : S.response) == null
                  ? void 0
                  : E.data) ||
                S.message ||
                "" + S
              }`,
            },
          })
        );
      }
    }
    async function O(f) {
      var E;
      if (confirm("Logout?"))
        try {
          const S = await le.post("/admin/rq/logout");
          (localStorage.access = ""), (location.href = location.origin);
        } catch (S) {
          P.error(
            i.jsx("div", {
              dangerouslySetInnerHTML: {
                __html: `${
                  ((E = S == null ? void 0 : S.response) == null
                    ? void 0
                    : E.data) ||
                  S.message ||
                  "" + S
                }`,
              },
            })
          ),
            v("/login"),
            (localStorage.access = "");
        }
    }
    function j() {
      document.documentElement.scrollHeight - window.innerHeight,
        setTimeout(() => {
          g == "Network Traffic" &&
            document
              .getElementById("bottom")
              .scrollIntoView({ inline: "center" });
        }, 40);
    }
    return (
      y.useEffect(() => {
        (document.title = "Sprintet  - " + o + " : Admin"), e();
        const f = ({ detail: E }) => {
          h((L) => [...L, { ...E, message: E.message.split("-")[0] }]);
          const S = {
            top: scrollY,
            height: document.documentElement.scrollHeight - window.innerHeight,
          };
          x(S), j();
        };
        return window.addEventListener("netlog", f), () => {};
      }, []),
      i.jsx("main", {
        id: "main",
        children: i.jsx("section", {
          className: "section site-portfolio py-5 darkTheme",
          children: i.jsxs("div", {
            className: "container",
            children: [
              i.jsxs("div", {
                className: "row mb-5",
                children: [
                  i.jsxs("div", {
                    className:
                      "d-flex flex-column flex-md-row slideIn mb-4 mb-lg-0",
                    "data-aos": "fade-up",
                    children: [
                      i.jsx("h2", {
                        className: "",
                        children: i.jsxs(xe, {
                          to: "/",
                          children: [
                            i.jsx("diviDotsNineBold", {
                              style: { fontSize: "2em", color: "steelblue" },
                              className: "text-primary icon",
                            }),
                            i.jsx(Ne.LazyLoadImage, {
                              effect: "opacity",
                              placeholder: i.jsx(Ee, {}),
                              src: "/sprintetName.png",
                              height: "100px",
                              alt: "",
                            }),
                          ],
                        }),
                      }),
                      i.jsxs("div", {
                        className: "ms-0 ms-md-auto",
                        children: [
                          i.jsx("div", {
                            className: "d-flex",
                            children: i.jsxs("div", {
                              className: "ms-auto",
                              children: [
                                i.jsx(xe, {
                                  to: "/admin/app/add",
                                  className:
                                    "rounded shadow-lg p-3 py-2 border border-dashed readmore custom-navmenu text-light",
                                  onClick: c,
                                  children: i.jsx(Uo, { className: "fs-4" }),
                                }),
                                i.jsx(xe, {
                                  onClick: () => O(),
                                  className:
                                    "rounded ms-2 shadow-lg p-3 py-2 border border-dashed readmore custom-navmenu bg-danger text-light",
                                  children: i.jsx(Hd, { className: "fs-4" }),
                                }),
                              ],
                            }),
                          }),
                          i.jsx("br", {}),
                          "Device Hostname: " + o,
                          i.jsx("br", {}),
                          "Mode: Administrator",
                        ],
                      }),
                    ],
                  }),
                  i.jsx("div", {
                    className: "text-start text-lg-end mt-3",
                    "data-aos": "fade-up",
                    "data-aos-delay": "100",
                    children: i.jsxs("div", {
                      id: "categories",
                      className: "ms-auto py-2 categories d-flex slideLeft",
                      style: { maxWidth: "98vw", overflow: "auto" },
                      children: [
                        i.jsxs("a", {
                          href: "#Visitors",
                          "data-category": "*",
                          className:
                            "p-1 mx-1 shadow rounded" +
                            (g == "Visitors" && "active rounded border"),
                          onClick: () => m("Visitors"),
                          children: ["Visitors", " "],
                        }),
                        i.jsxs("a", {
                          href: "#Forbidden",
                          "data-category": "*",
                          className:
                            "p-1 mx-1 shadow rounded" +
                            (g == "Forbidden" && "active rounded border"),
                          onClick: () => m("Forbidden"),
                          children: ["Forbidden", " "],
                        }),
                        i.jsxs("a", {
                          href: "#Protected Routes",
                          "data-category": "*",
                          className:
                            "p-1 mx-1 shadow rounded" +
                            (g == "Protected Routes" &&
                              "active rounded border"),
                          onClick: () => m("Protected Routes"),
                          children: ["Protected_Routes", " "],
                        }),
                        i.jsxs("a", {
                          href: "#Devices",
                          "data-category": "*",
                          className:
                            "p-1 mx-1 shadow rounded" +
                            (g == "Devices" && "active rounded border"),
                          onClick: () => m("Devices"),
                          children: ["Devices", " "],
                        }),
                        i.jsxs("a", {
                          href: "#NetworkTraffick",
                          "data-category": "*",
                          className:
                            "p-1 mx-1 shadow rounded" +
                            (g == "Network Traffic" && "active rounded border"),
                          onClick: () => m("Network Traffic"),
                          children: ["Network_Traffic", " "],
                        }),
                      ],
                    }),
                  }),
                ],
              }),
              (g == "All" || g == "Visitors") &&
                i.jsxs("div", {
                  className: "paper p-4 shadow",
                  children: [
                    i.jsx("h3", { className: "fw-bold", children: "Visitors" }),
                    i.jsxs("div", {
                      id: "",
                      className: "row active p-3 fw-bold",
                      "data-aos": "fade-up",
                      "data-aos-delay": "200",
                      children: [
                        i.jsx("div", {
                          className: "py-2 col-lg-3",
                          children: "Type/IP_Address",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-3",
                          children: "User_Agent",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-2",
                          children: "Last_Access",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-2",
                          children: "First_Access",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-2",
                          children: "Action",
                        }),
                      ],
                    }),
                    t.map((f, E) =>
                      i.jsxs(
                        "div",
                        {
                          id: "",
                          className: `row ${
                            n.find(
                              (S) =>
                                (f == null ? void 0 : f.addr) == S.addr &&
                                f.agent == S.agent
                            ) && "d-none"
                          } ${E % 2 !== 0 && "active"} p-3 fw-bold`,
                          "data-aos": "fade-up",
                          "data-aos-delay": "200",
                          children: [
                            i.jsxs("div", {
                              className: "py-2 col-lg-3",
                              children: [
                                f.type,
                                " ",
                                f == null ? void 0 : f.addr,
                              ],
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-3",
                              children: f == null ? void 0 : f.agent,
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-2",
                              children:
                                f == null ? void 0 : f.lastAccess.split("(")[0],
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-2",
                              children:
                                f == null ? void 0 : f.date.split("(")[0],
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-2",
                              children: i.jsx("button", {
                                className: "btn btn-danger",
                                onClick: () => {
                                  w(f);
                                },
                                children: "Forbid",
                              }),
                            }),
                          ],
                        },
                        "v" +
                          (f == null ? void 0 : f.addr) +
                          (f == null ? void 0 : f.agent)
                      )
                    ),
                  ],
                }),
              (g == "All" || g == "Forbidden") &&
                i.jsxs("div", {
                  className: "paper p-4 shadow mt-5",
                  children: [
                    i.jsx("h3", {
                      className: "fw-bold ",
                      children: "Forbidden ",
                    }),
                    i.jsxs("div", {
                      id: "",
                      className: "row active p-3 fw-bold",
                      "data-aos": "fade-up",
                      "data-aos-delay": "200",
                      children: [
                        i.jsx("div", {
                          className: "py-2 col-lg-3",
                          children: "Type/IP_Address",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-3",
                          children: "User_Agent",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-2",
                          children: "Last_Access",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-2",
                          children: "First_Access",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-2",
                          children: "Action",
                        }),
                      ],
                    }),
                    n.map((f, E) =>
                      i.jsxs(
                        "div",
                        {
                          id: "",
                          className: `row ${
                            E % 2 !== 0 && "active"
                          } p-3 fw-bold`,
                          "data-aos": "fade-up",
                          "data-aos-delay": "200",
                          children: [
                            i.jsxs("div", {
                              className: "py-2 col-lg-3",
                              children: [
                                f.type,
                                " ",
                                f == null ? void 0 : f.addr,
                              ],
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-3",
                              children: f == null ? void 0 : f.agent,
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-2",
                              children:
                                f == null ? void 0 : f.lastAccess.split("(")[0],
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-2",
                              children:
                                f == null ? void 0 : f.date.split("(")[0],
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-2",
                              children: i.jsx("button", {
                                className: "btn themebg",
                                onClick: () => N(f),
                                children: "Pardon",
                              }),
                            }),
                          ],
                        },
                        "f" +
                          (f == null ? void 0 : f.addr) +
                          (f == null ? void 0 : f.agent)
                      )
                    ),
                  ],
                }),
              g == "Protected Routes" &&
                i.jsxs("div", {
                  className: "paper p-4 shadow mt-5",
                  children: [
                    i.jsx("h3", {
                      className: "fw-bold ",
                      children: "Protected Routes ",
                    }),
                    i.jsxs("div", {
                      id: "",
                      className: "row active p-3 fw-bold",
                      "data-aos": "fade-up",
                      "data-aos-delay": "200",
                      children: [
                        i.jsx("div", {
                          className: "py-2 col-lg-10",
                          children: "Route",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-2",
                          children: "Action",
                        }),
                      ],
                    }),
                    s.map((f, E) =>
                      i.jsxs(
                        "div",
                        {
                          id: "",
                          className: `row ${
                            E % 2 !== 0 && "active"
                          } p-3 fw-bold`,
                          "data-aos": "fade-up",
                          "data-aos-delay": "200",
                          children: [
                            i.jsx("div", {
                              className: "py-2 col-lg-10",
                              children: f,
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-2",
                              children: i.jsx("button", {
                                className: "btn themebg",
                                onClick: () => _(f),
                                children: "Free Route",
                              }),
                            }),
                          ],
                        },
                        "f" + f
                      )
                    ),
                  ],
                }),
              (g == "All" || g == "Devices") &&
                i.jsxs("div", {
                  className: "paper p-4 shadow",
                  children: [
                    i.jsx("h3", { className: "fw-bold", children: "Devices" }),
                    i.jsxs("div", {
                      id: "",
                      className: "row active p-3 fw-bold",
                      "data-aos": "fade-up",
                      "data-aos-delay": "200",
                      children: [
                        i.jsx("div", {
                          className: "py-2 col-lg-3",
                          children: "ID",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-2",
                          children: "Address",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-3",
                          children: "Agent",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-1",
                          children: "Type",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-2",
                          children: "Date",
                        }),
                        i.jsx("div", {
                          className: "py-2 col-lg-1",
                          children: "Action",
                        }),
                      ],
                    }),
                    l.map((f, E) => {
                      var S, L;
                      return i.jsxs(
                        "div",
                        {
                          id: "",
                          className: `row ${
                            n.find(
                              (k) =>
                                (f == null ? void 0 : f.clientId) == k.addr &&
                                f.type == k.agent
                            ) && "d-none"
                          } ${E % 2 !== 0 && "active"} p-3 fw-bold`,
                          "data-aos": "fade-up",
                          "data-aos-delay": "200",
                          children: [
                            i.jsx("div", {
                              className: "py-2 col-lg-3",
                              children: f == null ? void 0 : f.clientId,
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-2",
                              children:
                                (S = f == null ? void 0 : f.user) == null
                                  ? void 0
                                  : S.addr,
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-2",
                              children:
                                (L = f == null ? void 0 : f.user) == null
                                  ? void 0
                                  : L.agent,
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-2",
                              children: f == null ? void 0 : f.type,
                            }),
                            i.jsx("div", {
                              className: "py-2 col-lg-2",
                              children: f == null ? void 0 : f.date,
                            }),
                            i.jsxs("div", {
                              className: "py-2 col-lg-1",
                              children: [
                                i.jsx("button", {
                                  className: "btn m-1 btn-danger",
                                  onClick: () => {
                                    T(f);
                                  },
                                  children: "Eject",
                                }),
                                !n.find((k) => {
                                  var A;
                                  return (
                                    (k == null ? void 0 : k.addr) ==
                                      f.user.addr &&
                                    (k == null ? void 0 : k.agent) ==
                                      ((A = f == null ? void 0 : f.user) == null
                                        ? void 0
                                        : A.agent)
                                  );
                                }) &&
                                  i.jsx("button", {
                                    className: "btn m-1 btn-danger",
                                    onClick: () => {
                                      w(f.user);
                                    },
                                    children: i.jsx("small", {
                                      className: "small",
                                      children: " Forbid Owner",
                                    }),
                                  }),
                              ],
                            }),
                          ],
                        },
                        "v" +
                          (f == null ? void 0 : f.clientId) +
                          (f == null ? void 0 : f.type)
                      );
                    }),
                  ],
                }),
              (g == "All" || g == "Network Traffic") &&
                i.jsx(Gm, { forbid: w, pardon: N, data: d, forbidden: n }),
              i.jsx("div", {
                className: "mt-5",
                style: { position: "fixed", bottom: "10px", left: "10px" },
              }),
              i.jsx(
                "div",
                { id: "bottom" },
                "Bottom dwelling div that never updates"
              ),
            ],
          }),
        }),
      })
    );
  };
function Gm({ data: e, forbid: t, forbidden: n, pardon: r }) {
  const [s, a] = y.useState(!1),
    [o, c] = y.useState(!0);
  return (
    y.useEffect(() => {
      const l = e.user;
      (async () =>
        a(
          !!n.find(
            (u) => (l == null ? void 0 : l.addr) == u.addr && l.agent == u.agent
          )
        ))();
    }, [n]),
    i.jsx(i.Fragment, {
      children: i.jsx("div", {
        id: "NetworkTraffic",
        children: i.jsxs("div", {
          className: "paper p-4 shadow",
          children: [
            i.jsxs("div", {
              id: "",
              className: "row  pb-1 fw-bold",
              "data-aos": "fade-up",
              "data-aos-delay": "200",
              style: { position: "sticky", top: "0px", background: "#5a5a5a" },
              children: [
                i.jsxs("h3", {
                  className: "fw-bold d-flex mt-0",
                  style: { background: "#2f2f2f" },
                  children: [
                    "Network Traffic",
                    i.jsx("div", {
                      className: "ms-auto",
                      onClick: () => c((l) => !l),
                      children: o
                        ? i.jsxs("div", {
                            className: "btn",
                            children: [
                              `${e.length > 100 ? e.length - 100 : 0} ─ ${
                                e.length
                              }`,
                              " ",
                              i.jsx($o, { className: "icon" }),
                            ],
                          })
                        : i.jsxs("div", {
                            className: "btn",
                            children: [
                              e.length,
                              " ",
                              i.jsx(zo, { className: "icon" }),
                            ],
                          }),
                    }),
                  ],
                }),
                i.jsx("div", {
                  className: "py-1 col-10 col-lg-10",
                  children: "Type/IP_Address",
                }),
                i.jsx("div", {
                  className: "py-1 col-lg-2 d-flex",
                  children: i.jsx("span", {
                    className: "ms-md-auto pe-md-3",
                    children: "Action",
                  }),
                }),
              ],
            }),
            (o
              ? e.slice(e.length > 100 ? e.length - 100 : 0, e.length)
              : e
            ).map(({ message: l, user: u }, d) =>
              i.jsxs(
                "div",
                {
                  id: "",
                  className: `row ${d % 2 !== 0 && "active"}  fw-bold`,
                  "data-aos": "fade-up",
                  "data-aos-delay": "200",
                  children: [
                    i.jsx("div", { className: "py-1 col-md-10", children: l }),
                    i.jsx("div", {
                      className: "py-1 col-md-2 d-flex",
                      children: i.jsx("button", {
                        style: { fontSize: "0.8em" },
                        className: `btn ${
                          s ? "themebg" : "bg-danger"
                        } my-md-auto ms-md-auto me-0 btn-small p-1 text-small`,
                        onClick: () => {
                          s ? r(u) : t(u);
                        },
                        children: s ? "Pardon User" : "Forbid User",
                      }),
                    }),
                  ],
                },
                "f" + l + d
              )
            ),
          ],
        }),
      }),
    })
  );
}
const Km = y.lazy(() =>
    Vo(() => import("./Index-DvxfPTXZ.js"), __vite__mapDeps([0, 1, 2]))
  ),
  Qm = () => {
    const { pop: e } = _e(),
      t = We();
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx(ll, { progressStyle: { opacity: "0" } }),
        i.jsxs(Fc, {
          children: [
            i.jsx(oe, { path: "/login", element: i.jsx(Um, {}) }),
            i.jsx(oe, { path: "/about", element: i.jsx(Mm, {}) }),
            i.jsx(oe, { path: "/contact", element: i.jsx(Bm, {}) }),
            i.jsxs(oe, {
              path: "fsexplorer",
              element: i.jsx($m, { children: i.jsx(zm, {}) }),
              children: [
                i.jsx(oe, { index: !0, element: i.jsx(_a, {}) }),
                i.jsx(oe, { path: "*", element: i.jsx(_a, {}) }),
              ],
            }),
            i.jsx(oe, {
              path: "/touchpad",
              element: i.jsx(i.Fragment, {
                children:
                  t.pathname.includes("touchpad") &&
                  i.jsx(y.Suspense, {
                    fallback: i.jsx(Wo, { animate: !0 }),
                    children: i.jsx(lr, { sudo: !0, children: i.jsx(Km, {}) }),
                  }),
              }),
            }),
            i.jsxs(oe, {
              path: "/admin",
              element: i.jsx(lr, { sudo: !0 }),
              children: [
                i.jsx(oe, { index: !0, element: i.jsx(Jm, {}) }),
                i.jsx(oe, { path: "app", element: i.jsx(ja, {}) }),
              ],
            }),
            i.jsxs(oe, {
              path: "/",
              element: i.jsx(lr, {}),
              children: [
                i.jsx(oe, { index: !0, element: i.jsx(Fm, {}) }),
                i.jsx(oe, { path: "app/add", element: i.jsx(ja, {}) }),
              ],
            }),
            i.jsxs(oe, {
              path: "/os",
              element: i.jsxs(i.Fragment, {
                children: [i.jsx(Im, {}), i.jsx(Ff, {}), i.jsx(Jr, {})],
              }),
              children: [
                i.jsx(oe, { index: !0, element: i.jsx(xa, {}) }),
                i.jsx(oe, { path: "/os:page", element: i.jsx(xa, {}) }),
              ],
            }),
          ],
        }),
        e &&
          i.jsx("div", {
            className: "d-flex w-100",
            style: {
              position: "fixed",
              top: "0px",
              bottom: "0px",
              right: "0px",
              leftt: "0px",
              backgroundColor: "#afefff10",
              zIndex: "10000",
            },
            children: e,
          }),
      ],
    });
  };
function Zm() {
  return i.jsx(Yc, { children: i.jsx(Pd, { children: i.jsx(Qm, {}) }) });
}
const Ep = Object.freeze(
  Object.defineProperty({ __proto__: null, default: Zm }, Symbol.toStringTag, {
    value: "Module",
  })
);
export { Ep as A, bp as B, $d as M, Ff as O, P as a, wp as b, _e as u };
