"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/lib/appwrite";

export interface UserPrefs {
    reputation: number;
}

interface IAuthStore {
    session: Models.Session | null;
    jwt: string | null;
    user: Models.User<UserPrefs> | null;
    hydrated: boolean;

    setHydrated: () => void;
    verifySession: () => Promise<void>;

    login: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; error: AppwriteException | null }>;

    createAccount: (
        email: string,
        password: string
    ) => Promise<{ success: boolean; error: AppwriteException | null }>;

    logout: () => Promise<void>;
}
//zustand is a small, fast, and scalable state management solution for React applications. It provides a simple API for creating and managing global state in your application. In this code, we define an authentication store using Zustand that manages the user's session, JWT token, and user information. We also use two middleware functions: immer and persist.
//immer allows us to write mutable code while keeping the state immutable under the hood, which is a common pattern in Zustand stores. persist allows us to save the store's state to localStorage (or another storage solution) so that it persists across page reloads.
//persist also provides an onRehydrateStorage callback, which we use to set the hydrated flag once the state has been rehydrated from storage. This can be useful for components that need to know when the store is ready to be used after a page reload.
//rehydration is the process of restoring the state of the store from storage (like localStorage) when the application loads. This allows the user's session to persist across page reloads, so they don't have to log in again every time they refresh the page.
export const useAuthStore = create<IAuthStore>()(
    persist(
        immer((set) => ({
            session: null,
            jwt: null,
            user: null,
            hydrated: false,

            setHydrated: () => {
                set({ hydrated: true });
            },

            async verifySession() {
                try {
                    const [session, user, { jwt }] = await Promise.all([
                        account.getSession("current"),
                        account.get<UserPrefs>(),
                        account.createJWT()
                    ]);
                    set({ session, user, jwt });
                } catch (error) {
                    set({ session: null, jwt: null, user: null });
                }
            },

            async login(email, password) {
                try {
                    const session = await account.createEmailPasswordSession(
                        email,
                        password
                    );

                    const [user, { jwt }] = await Promise.all([
                        account.get<UserPrefs>(),
                        account.createJWT()
                    ]);

                    set({ session, user, jwt });

                    return { success: true, error: null };
                } catch (error) {
                    return {
                        success: false,
                        error: error as AppwriteException
                    };
                }
            },

            async createAccount(email, password) {
                try {
                    await account.create(ID.unique(), email, password);
                    const session = await account.createEmailPasswordSession(
                        email,
                        password
                    );
                    const [user, { jwt }] = await Promise.all([
                        account.get<UserPrefs>(),
                        account.createJWT()
                    ]);

                    set({ session, user, jwt });
                    if(!user.prefs?.reputation) await account.updatePrefs({ reputation: 0 });

                    return { success: true, error: null };
                } catch (error) {
                    return {
                        success: false,
                        error: error as AppwriteException
                    };
                }
            },

            async logout() {
                try {
                    await account.deleteSession("current");
                } finally {
                    set({ session: null, jwt: null, user: null });
                }
            }
        })),
        {
            name: "auth",
            onRehydrateStorage: () => (state, error) => {
                if (!error) state?.setHydrated();
            }
        }
    )
);
