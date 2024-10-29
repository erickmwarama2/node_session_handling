exports.getLogin = (req, res, next) => {
  console.log(req.get("Cookie").split(";"));
  const cookies = req.get("Cookie").split(";");
  const isLoggedIn =
    cookies
      .filter((cookie) => cookie.trim().split("=")[0] == "loggedIn")
      .map((cookie) => cookie.trim().split("=")[1]) == "true";
  console.log(`isLoggedIn: ${isLoggedIn}`);

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
//   res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
    req.session.isLoggedIn = true;
  res.redirect("/");
};
