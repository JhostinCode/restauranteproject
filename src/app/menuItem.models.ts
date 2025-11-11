export class menuItem{
    name:string = "";
    price:number = 0.00;
    image_path:string = ""

    constructor(name:string,price:number,image_path:string){
        this.name = name;
        this.price = price;
        this.image_path = image_path;
    }
}