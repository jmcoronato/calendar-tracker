import { Router, Request } from "express";
import passport from "../auth/passport";

const router = Router();

router.get(
    "/google",
    passport.authenticate("google", {
        scope: [
            "openid",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
        prompt: "consent",
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/api/auth/failure" }),
    (req, res) => {
        const redirectUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        res.redirect(redirectUrl);
    }
);

router.get("/failure", (_req, res) => {
    res.status(401).json({ error: "Authentication failed" });
});

router.get("/me", (req: Request, res) => {
    if (!req.user) return res.status(401).json({ user: null });
    res.json({ user: req.user });
});

router.post("/logout", (req: Request, res, next) => {
    (req as any).logout(function (err: any) {
        if (err) return next(err);
        req.session?.destroy(() => {
            res.clearCookie("connect.sid");
            res.status(204).send();
        });
    });
});

export default router;


