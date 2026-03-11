import { answerCollection, db } from "@/models/name";
import { database, user } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server"
import { ID } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";

export async function POST(request: NextRequest) {
    try {
        const { questionId, answer, authorId } = await request.json();

        const response = await database.createDocument(db, answerCollection, ID.unique(), {
            content:answer,
            authorId:authorId,
            questionId:questionId,

        })
        //increase author reputation
       const prefs=await user.getPrefs<UserPrefs>(authorId)

       await user.updatePrefs(authorId,{
        reputation: Number(prefs.reputation)+1
       })
      
        return NextResponse.json(response,{status:201})
    } catch (error: unknown) {
        return NextResponse.json({
            error: (error as { message?: string })?.message || "Error creating answer"
        },
            {
                status: (error as { status?: number; code?: number })?.status || (error as { status?: number; code?: number })?.code || 500

            }
        )

    }
}

export async function DELETE(request:NextRequest){
    try {
        const { answerId, authorId } = await request.json();

        const response = await database.deleteDocument(db, answerCollection, answerId)

        //decrease author reputation
        const prefs = await user.getPrefs<UserPrefs>(authorId)

        await user.updatePrefs(authorId, {
            reputation: Number(prefs.reputation) - 1
        })

        return NextResponse.json(response)
    } catch (error: unknown) {
        return NextResponse.json({
            error: (error as { message?: string })?.message || "Error deleting answer"
        },
            {
                status: (error as { status?: number; code?: number })?.status || (error as { status?: number; code?: number })?.code || 500

            }
        )
    }
}
