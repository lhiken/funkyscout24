class Note {
    static coor: Array<Array<number>> = [
        [27.5, 60],
        [92.5, 60],
        [157.5, 60],
        [222.5, 60],
        [287.5, 60],
        [44, 275],
        [101, 275],
        [157.5, 275]
    ];
    static color: string = "#CDA745";
    static colorDim: string = "#302A1B";
    static width: number = 17.5;

    num!: number;
    x!: number;
    y!: number;
    

    buttonSize: number = 100;
    isClicked : boolean = false;
    success:boolean|undefined;

    constructor(num: number) {
        this.num = num;
        if (num >= 0 && Note.coor[num][1]) {
            this.x = Note.coor[this.num][0];
            this.y = Note.coor[this.num][1];
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if(!this.isClicked){
        ctx.strokeStyle = Note.color;
        }
        else{
            ctx.strokeStyle = Note.colorDim;
        }
        ctx.lineWidth = Note.width*0.35;
        ctx.beginPath();
        ctx.arc(this.x + Note.width / 2, this.y + Note.width / 2, Note.width, 0, Math.PI * 2);
        ctx.stroke();
    }

}

export default Note;
