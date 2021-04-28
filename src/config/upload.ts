import crypto from "crypto";
import multer from "multer";
import { resolve } from "path";

export default {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    upload(folder: string) {
        return {
            // Returning an object
            storage: multer.diskStorage({
                destination: resolve(__dirname, "..", "..", folder),
                filename: (request, file, callback) => {
                    const fileHash = crypto.randomBytes(16).toString("hex"); // Gerando um Crypto do próprio node
                    const fileName = `${fileHash}-${file.originalname}`; // Concatenando

                    return callback(null, fileName);
                },
            }),
        };
    },
};
