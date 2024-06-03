import NextAuth from "next-auth";

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import crypto from "crypto"

export const authOptions = (req, res) => {
    return {
        // Configure one or more authentication providers
        providers: [
            GithubProvider({
                clientId: process.env.GITHUB_ID,
                clientSecret: process.env.GITHUB_SECRET,
                authorization: {
                    params: { scope: "user,user:email" },
                },
            }),
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                authorization: {
                    params: {
                        // https://www.googleapis.com/auth/user.birthday.read
                        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
                    },
                },
            }),
            CredentialsProvider({
                id: "credentials",
                name: "Credentials",
                credentials: {
                    email: {
                        label: "Email",
                        type: "text",
                        placeholder: "email@site.com",
                    },
                    password: {
                        label: "Password",
                        type: "password",
                        placeholder: "password",
                    },
                },
                async authorize(credentials, req) {
                    

                    // You need to provide your own logic here that takes the credentials
                    // submitted and returns either a object representing a user or value
                    // that is false/null if the credentials are invalid.
                    // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                    // You can also use the `req` object to obtain additional parameters
                    // (i.e., the request IP address)
                    
                    
                    const passwordHash = crypto.pbkdf2Sync(credentials.password, 'salt', 10000, 64, 'sha512').toString("hex")
                    credentials.password = passwordHash
                    
                    
                    const resLogin = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/login`,
                        {
                            method: "POST",
                            body: JSON.stringify(credentials),
                            headers: { "Content-Type": "application/json" },
                        }
                    );

                    try {
                        if (!resLogin.ok)
                            throw new Error(await resLogin.text());
                        const user = await resLogin.json();

                        

                        // If no error and we have user data, return it
                        if (resLogin.ok && user) {
                            return {
                                name: user.nombre,
                                email: user.token,
                            };
                        }
                    } catch (error) {
                        
                        throw new Error(error.message);
                    }

                    // Return null if user data could not be retrieved
                },
            }),
            // ...add more providers here
        ],
        pages: {
            signIn: "/login",
            signOut: "/",
            error: "/auth/error", // Error code passed in query string as ?error=
            newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
        },
        session: {
            strategy: "jwt",
            maxAge: 60 * 60 * 24 * 30,
        },
        callbacks: {
            async signIn({ user, account, profile }) {
                if (account.provider === "google") {
                    
                    const resLogin = await (
                        await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/loginGoogle`,
                            {
                                method: "POST",
                                body: JSON.stringify({
                                    email: profile.email,
                                    name: profile.name,
                                }),
                                headers: { "Content-Type": "application/json" },
                            }
                        )
                    ).json();
                    user.name = resLogin.name;
                    user.email = resLogin.token;
                    
                    
                    return true;
                } else if (account.provider === "github") {
                    
                    /*
                    const octokit = new Octokit({
                        auth: account.access_token,
                    });

                    const emails = await octokit.request("GET /user/emails", {
                        headers: {
                            "X-GitHub-Api-Version": "2022-11-28",
                        },
                    });
                    
                    */

                    const resLogin = await (
                        await fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/loginGithub`,
                            {
                                method: "POST",
                                body: JSON.stringify({
                                    email: profile.email,
                                    name: profile.login,
                                }),
                                headers: { "Content-Type": "application/json" },
                            }
                        )
                    ).json();
                    user.name = resLogin.name;
                    user.email = resLogin.token;
                    
                    
                    return true;
                }
                return true; // Do different verification for other providers that don't have `email_verified`
            },
            async session({ session, token, user }) {
                
                
                const id = await jwt.decode(session.user.email).idUsuario;
                let newSession = {
                    ...session,
                    user: {
                        ...session.user,
                        id: id,
                        token: session.user.email,
                        admin: await (
                            await fetch(
                                `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/${id}/admin`
                            )
                        ).json(),
                    },
                };
                delete newSession.user["email"];
                return newSession;
            },
        },
        // cookies: {
        //     sessionToken: {
        //         name: `jwt`,
        //         options: {
        //             httpOnly: true,
        //             sameSite: "lax",
        //             path: "/",
        //             secure: true,
        //         },
        //     },
        // },
        // jwt: {
        //     // The maximum age of the NextAuth.js issued JWT in seconds.
        //     // Defaults to `session.maxAge`.
        //     maxAge: 60 * 60 * 24 * 30,
        //     // You can define your own encode/decode functions for signing and encryption
        //     async encode() {},
        //     async decode() {},
        // },
    };
};

const handler = (req, res) => {
    return NextAuth(req, res, authOptions(req, res));
};

// const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
