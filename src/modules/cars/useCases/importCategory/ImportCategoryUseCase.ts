import csvParse from "csv-parse";
import fs from "fs";
import { inject, injectable } from "tsyringe";

import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository";

interface IImportCategory {
    name: string;
    description: string;
}

@injectable()
class ImportCategoryUseCase {
    constructor(
        @inject("CategoriesRepository")
        private categoriesRepository: ICategoriesRepository
    ) {
        //
    }

    loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
        // Creating a Promise
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(file.path); // Aquivo sendo lendo em partes por conta do stream

            const categories: IImportCategory[] = [];

            const parseFile = csvParse(); // Variavel com o metodo cvsParse

            stream.pipe(parseFile); // Passando o chunck lido do arquivo para o parseFile

            parseFile
                .on("data", async (line) => {
                    // em "data"
                    // ["name","description"];
                    const [name, description] = line; // parameter 'line' receives an array desistructure array getting [name,description]
                    categories.push({
                        name, // Assing values in the array
                        description,
                    });
                })

                // Promise on success finish -> resolve Categories
                .on("end", () => {
                    resolve(categories);
                })
                // Promise on success finish -> resolve Categories
                .on("error", (err) => {
                    reject(err);
                });
        });
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const categories = await this.loadCategories(file);
        console.log(categories);

        categories.map(async (category) => {
            const { name, description } = category;

            const existCategory = await this.categoriesRepository.findByName(
                name
            );

            if (!existCategory) {
                await this.categoriesRepository.create({
                    name,
                    description,
                });
            }
        });
    }
}

export { ImportCategoryUseCase };
