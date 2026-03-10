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
