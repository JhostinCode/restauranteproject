export class inventoryItem{
    name:string = "";
    price:number = 0.00;
    stock:number = 0

    constructor(name:string,price:number,stock:number){
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
}