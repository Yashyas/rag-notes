"use server"

import { EmbedService } from "@/lib/embedService"
import { prisma } from "@/lib/prisma"
import { Note } from "@prisma/client";

// create note 
export async function createNote(content:string , title:string , tags:string[]){
    if(!content || !title){
        return {success: false , error: "Enter valid title and content"}
    }
    try {
        // create embedding 
        const embeddingText = `Tags: ${tags.join(", ")}; Title: ${title}; Content: ${content}`;
        const embedding = await EmbedService.generateEmbedding(embeddingText)
        const vectorString = `[${embedding.join(",")}]`

        const note = await prisma.$queryRaw<Note[]>`
        INSERT INTO "Note" (id,title,content,embedding,tags,"createdAt","updatedAt")
        VALUES (
            gen_random_uuid(),
            ${title},
            ${content},
            ${vectorString}::vector,
            ${tags},
            NOW(),
            NOW()
        )
        RETURNING *;
        `;
        return {success:true , data:note[0]}
  
    } catch (error) {
        console.log(error)
        return {success:false, error:"Failed to process note embedding."}
    }
}

// fetch all notes 
export async function fetchNotes() {
    try {
        const notes = await prisma.note.findMany({
            orderBy:{updatedAt: "desc"},
        })
        return {success:true , data:notes}
    } catch (error) {
        return {success:false, error: "Couldn't fetch notes."}
    }
}

// Update notes 
export async function updateNoteDatabase(id:string , content:string , title:string, tags:string[]){
    if(!content || !title){
        return {success: false , error: "Enter valid title and content"}
    }
    try {
        // create embedding 
        const embeddingText = `Tags: ${tags.join(", ")}; Title: ${title}; Content: ${content}`;
        const embedding = await EmbedService.generateEmbedding(embeddingText)
        const vectorString = `[${embedding.join(",")}]`

        const note = await prisma.$queryRaw`
        UPDATE "Note" 
        SET 
            title = ${title},
            content = ${content},
            embedding = ${vectorString}::vector,
            tags = ${tags},
            "updatedAt" = NOW()
        WHERE id = ${id}
        RETURNING *;
        `;
        return {success:true , data:note}
  
    } catch (error) {
        console.log(error)
        return {success:false, error:"Failed to process note embedding."}
    }
}

// Delete notes 
export async function deleteNote(id :string) {
    try {
        const notes = await prisma.note.delete({
            where:{
                id:id,
            }
        })
        return {success:true , data:notes}
    } catch (error) {
        return {success:false, error: "Couldn't fetch notes."}
    }
}