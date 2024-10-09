class Button {

    static coor: Array<Array<number>> = [[30, 10], [90, 10], [150, 10], [210, 10], [270, 10], [30, 200], [90, 200], [150, 200]];

    num!: number;
    x!: number;
    y!: number;
    width: number = 15;
    color: string = '#CDA745';

    constructor(num: number) {
        this.num = num;
        if (num >= 0 && Button.coor[num][1]) {
            this.x = Button.coor[this.num][0];
            this.y = Button.coor[this.num][1];
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {

        
        ctx.strokeStyle = this.color;
        ctx.lineWidth =5;
        ctx.beginPath();
        ctx.arc(this.x , this.y + this.width / 2, this.width, 0, Math.PI * 2);
        ctx.stroke();
    }

    isClicked(x:number, y:number) {
        return x > this.x -2 && x < this.x + this.width+2 && y > this.y-2 && y < this.y + this.width+2;
    }



}
export default Button;