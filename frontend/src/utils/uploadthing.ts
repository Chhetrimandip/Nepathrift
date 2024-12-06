import { createUploadthing, type FileRouter } from "uploadthing/next"
import { auth } from '@clerk/nextjs'

const f = createUploadthing()

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async ({ req }) => {
      // Verify user is authenticated
      const user = await auth()
      if (!user) throw new Error("Unauthorized")

      return { userId: user.userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("File URL:", file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter 