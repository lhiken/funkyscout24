class Button {
    static coor: Array<Array<number>> = [
        [30, 20],
        [90, 20],
        [150, 20],
        [210, 20],
        [270, 20],
        [30, 200],
        [90, 200],
        [150, 200],
    ];
    static color: string = "#CDA745";
    static colorDim: string = "#302A1B";

    num!: number;
    x!: number;
    y!: number;
    width: number = 15;

    buttonSize: number = 100;
    isClicked : boolean = false;

    constructor(num: number) {
        this.num = num;
        if (num >= 0 && Button.coor[num][1]) {
            this.x = Button.coor[this.num][0];
            this.y = Button.coor[this.num][1];
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = Button.color;
        if (this.isClicked == true ){
            ctx.strokeStyle = Button.colorDim;
        }
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(this.x, this.y + this.width / 2, this.width, 0, Math.PI * 2);
        ctx.stroke();
    }

}
export default Button;
