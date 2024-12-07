import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getAuthUser } from '@/lib/auth'

const f = createUploadthing()

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async () => {
      const user = await getAuthUser()
      if (!user) throw new Error("Unauthorized")

      return { userId: user.uid }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("File URL:", file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter 