class Note {
    static offset = 1

    static coor: Array<Array<number>> = [
        [27.5, 60],
        [92.5, 60],
        [157.5, 60],
        [222.5, 60],
        [287.5, 60],
        [44, 295],
        [101, 295],
        [157.5, 295],
    ].map((point) => point.map((coord) => coord * this.offset));
    static Position = [
        {x:44,y:380},
        {x:101,y:350},
        {x:157.5,y:380},
    ];
    static color: string = "#CDA745";
    static colorDim: string = "#302A1B";
    static stroke: string = "#CDA74577"
    static width: number = 17.5;
    static buttonSize: number = 100;

    num!: number;
    x!: number;
    y!: number;

    isClicked: boolean = false;
    success: boolean | undefined;

    constructor(num: number) {
        this.num = num;
        if (num >= 0 && Note.coor[num][1]) {
            this.x = Note.coor[this.num][0];
            this.y = Note.coor[this.num][1];
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isClicked) {
            ctx.strokeStyle = Note.color;
        } else {
            ctx.strokeStyle = Note.colorDim;
        }
        ctx.lineWidth = Note.width * 0.35;
        ctx.beginPath();
        ctx.arc(
            this.x + Note.width / 2,
            this.y + Note.width / 2,
            Note.width,
            0,
            Math.PI * 2,
        );
        ctx.stroke();
    }
}

export default Note;
