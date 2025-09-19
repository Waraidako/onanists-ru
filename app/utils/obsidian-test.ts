import {Obsidian} from "./obsidian";

const obsidian = new Obsidian("https://onanists:onanists123@obsidian.servermaksa.ru");

console.log("getting all files...")
console.log(await obsidian.getAllFilesList());

console.log("getting updated files...")
console.log(await obsidian.getUpdatedFilesList(new Date("2025-09-01T00:00:00")));

console.log("printing a file...")
console.log(await obsidian.getFile("Маршрутка/Пикчи/er_min.jpg"));
console.log("printing a file...")
console.log(await obsidian.getFile("Readme.md"));

// console.log("saving a file...")
// await obsidian.saveFile("Маршрутка/Пикчи/er_min.jpg","test_image.jpg");
// console.log("saving a file...")
// await obsidian.saveFile("Readme.md","test_text.md");
