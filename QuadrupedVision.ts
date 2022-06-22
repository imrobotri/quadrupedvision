//Position value||位置值
enum Position {
    //% block="Content V"
    Content_V,
    //% block="X axis"
    X_axis,
    //% block="Y axis"
    Y_axis,
    //% block="Z axis"
    Z_axis,
    //% block="X axis flip"
    X_flip,
    //% block="Y axis flip"
    Y_flip,
    //% block="Z axis flip"
    Z_flip,
}

//Ball position||球的位置值
enum Ball_Position {
    //% block="status"
    status,
    //% block="X axis"
    X_axis,
    //% block="Y axis"
    Y_axis,
    //% block="Width "
    Width,
    //% block="Depth "
    Depth,
    //% block="Recognition effect"
    Re_effect
}

//Line inspection||巡线
enum Line_Position {
    //% block="status"
    status,
    //% block="Recognition_effect"
    Re_effect,
    //% block="Deviation_angle"
    De_angle,
    //% block="Deviation_position"
    De_position
}

//colour||颜色
enum enColor {
    //%  block="Red"
    Red,
    //%  block="Green"
    Green,
    //% block="Blue"
    Blue,
    //%  block="White"
    White,
    //%  block="Cyan"
    Cyan,
    //%  block="Pinkish"
    Magenta,
    //%  block="Yellow"
    Yellow,
}

//识别功能ID
enum FunctionID {
    ////% block="color label"
    color = 1,
    //% block="Tag label"
    Tag = 5,
}

//识别功能ID
enum FunctionID1 {
    //% block="Seek ball"
    ball = 2,
    //% block="Shape inspection"
    Shape = 4,
}



//识别颜色ID
enum ColorID {
    //% block="Red"
    Red = 1,
    //% block="Blue"
    Blue = 2,
    //% block="Yellow"
    Yellow = 3,
    //% block="Green"
    Green = 4,
}

//识别颜色ID
enum ColorLineID {
    //% block="Black"
    Black = 1,
    //% block="Red"
    Red = 2,
}

//识别形状ID
enum ShapeID {
    //% block="none"
    None = 0,
    //% block="Triangle"
    Triangle = 1,
    //% block="Rectangle"
    Rectangle = 2,
    //% block="Round"
    Round = 3,
}


/**
 * Quadruped
 */
//% weight= 0 color=#0abcff icon="\uf201" block="QuadrupedVision"
//% groups='["Set up","control","Additional steering gear control","Joint angle control"]'
namespace QuadrupedVision {
    //------------definition--------------
    let Identify_TX = pins.createBuffer(30)
    let Identify_TX1 = pins.createBuffer(30)
    let Identify_TX2 = pins.createBuffer(8)
    let Identify_RX = pins.createBuffer(80)
    let cnt_p = 0
    let CRC_L = 0x00
    let CRC_H = 0x00
    let CRC_tx_L = 0x00
    let CRC_tx_H = 0x00
    let CRC_tx_L1 = 0x00
    let CRC_tx_H1 = 0x00
    let FunID = 0x00
    let ColID = 0x00
    let Line_ColID = 0x00
    let ShaID = 0x00
    let ShaColID = 0x00
    let ReturnData = {
        Color_ID:0,
        Ball_status:0,
        Ball_X:0,
        Ball_Y:0,
        Ball_W:0,
        Ball_H:0,
        Ball_pixels:0,
        Line_detect:0,
        Line_effect:0,
        Line_angle:0,
        Line_position:0,
        Shapes_ID: 0,
        Identify_pattern: 0,
        Identify_x: 0,
        Identify_y: 0,
        Identify_z: 0,
        Identify_Flip_x: 0,
        Identify_Flip_y: 0,
        Identify_Flip_z: 0,

    }
    // 功能启动
    function IRecognitionSettings() {
        cnt_p = 0
        Identify_TX1[0] = 0x00
        Identify_TX[cnt_p++] = 0x01 // 设备ID
        Identify_TX[cnt_p++] = 0x10	//mudbus功能ＩＤ
        Identify_TX[cnt_p++] = 0x00
        Identify_TX[cnt_p++] = 0x00	//寄存器起始位
        Identify_TX[cnt_p++] = 0x00
        Identify_TX[cnt_p++] = 0x0A  //数量
        Identify_TX[cnt_p++] = 0x14	//有效数据长度
        Identify_TX[cnt_p++] = 0x00
        Identify_TX[cnt_p++] = 0x01 	//启动状态	
        Identify_TX[cnt_p++] = 0x00
        Identify_TX[cnt_p++] = FunID 	//图像ＩＤ
        Identify_TX[cnt_p++] = 0x00
        Identify_TX[cnt_p++] = ColID　	//颜色ＩＤ
        Identify_TX[cnt_p++] = 0x00
        Identify_TX[cnt_p++] = Line_ColID　//颜色线ＩＤ
        Identify_TX[cnt_p++] = 0x00
        Identify_TX[cnt_p++] = ShaColID　//形状颜色ＩＤ	
        for (let i = 0; i < 10; i++)
            Identify_TX[cnt_p++] = 0
        for (let i = 0; i < cnt_p; i++)
            Identify_TX1[i + 1] = Identify_TX[i]
        usMBCRC161(Identify_TX1, cnt_p + 1)
        // serial.writeBuffer(Identify_TX)
        Identify_TX[cnt_p++] = CRC_tx_H1
        Identify_TX[cnt_p++] = CRC_tx_L1
        serial.writeBuffer(Identify_TX)
        basic.pause(100)
    }
    //Data sending（Image Identification）||数据发送（图像识别）
    function Identify_send() {
        cnt_p = 0
        Identify_TX1[0] = 0x00
        Identify_TX2[cnt_p++] = 0x01 // ID
        Identify_TX2[cnt_p++] = 0x03
        Identify_TX2[cnt_p++] = 0x00
        Identify_TX2[cnt_p++] = 0x0A //Function_c
        Identify_TX2[cnt_p++] = 0x00
        Identify_TX2[cnt_p++] = 0x1E
        for (let i = 0; i < cnt_p; i++)
            Identify_TX1[i + 1] = Identify_TX2[i]
        usMBCRC161(Identify_TX1, cnt_p + 1)
        // serial.writeBuffer(Identify_TX)
        Identify_TX2[cnt_p++] = CRC_tx_H1
        Identify_TX2[cnt_p++] = CRC_tx_L1
        serial.writeBuffer(Identify_TX2)
        basic.pause(15)
    }
    //Data reception（Image Identification）||数据接收（图像识别）
    function Identify_receive() {
        //serial.setRxBufferSize(32)
        let position_r = 0
        let sum_r = 0x00
        let length_r = 0
        let cnt_I = 3
        Identify_RX = serial.readBuffer(0)
        if (Identify_RX[0] == 0x01 && Identify_RX[1] == 0x03) {
            length_r = Identify_RX[2]
            usMBCRC16(Identify_RX, length_r + 3)
            // basic.showNumber(length_r)     
            if (Identify_RX[length_r + 3] == CRC_H && Identify_RX[length_r + 4] == CRC_L) {
                //颜色识别
                ReturnData.Color_ID = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])
                //小球跟踪
                ReturnData.Ball_status = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])
                ReturnData.Ball_X = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])
                ReturnData.Ball_Y = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])
                ReturnData.Ball_W = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])
                ReturnData.Ball_H = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])
                ReturnData.Ball_pixels = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])
                //巡线
                ReturnData.Line_detect = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++]) //Detect
                ReturnData.Line_effect = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++]) //The effect of the identification line
                ReturnData.Line_angle = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++]) //angle
                ReturnData.Line_position = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])//position
                //形状
                ReturnData.Shapes_ID = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])       //
                //标签
                //Identify_status = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])   //
                ReturnData.Identify_pattern = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])  //
                ReturnData.Identify_x = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])        //
                ReturnData.Identify_y = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])        //
                ReturnData.Identify_z = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])        //
                ReturnData.Identify_Flip_x = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])   //
                ReturnData.Identify_Flip_y = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])   //
                ReturnData.Identify_Flip_z = Data_conversion(Identify_RX[cnt_I++], Identify_RX[cnt_I++])   //

                //basic.showNumber(5)     
                return 2

            }
            //return 2
        }
        else if (Identify_RX[0] == 0x01 && Identify_RX[1] == 0x10) {

            //length_r = Identify_RX[2]
            usMBCRC16(Identify_RX, 6)
            if (Identify_RX[6] == CRC_H && Identify_RX[7] == CRC_L) {

                return 1

            }
        }

        return 0
    }




    //###Image recognition initialization||图像识别初始化
    /**
    * IODO:Image recognition internal related pins and settings initialization
    * IODO:图像识别内部相关引脚和设置初始化
    */
    //% blockGap=8
    //% blockId=QuadrupedVision_Image_ini block="Image recognition initialization"
    export function Image_init() {
        serial.setRxBufferSize(80)
        serial.setTxBufferSize(8)
    }
    //OnToggleIdentify 开启/切换(颜色、标签、二维码)
    /**
     * IODO: Turn on the color or label recognition function for setting graphics.
     * IODO:开启设置图形的颜色或者标签识别功能。
     */
    //% blockGap=8
    //% blockId=OnToggle block="OnToggle|%Fun"
    export function OnToggle(Fun: FunctionID): void {
        FunID = Fun
        let i = 0
        IRecognitionSettings()
        while (1) {
            if (Identify_receive() == 1)//|| (i++)>10
                return
            IRecognitionSettings()
            basic.pause(100)

        }

    }
    //OnToggle1 开启/切换(小球、形状、巡线)
    /**
     * IODO:Turn on the Settings Graphic Recognition function to select balls, shapes, and lines, as well as the corresponding recognition colors.
     * IODO:开启设置图形识别功能，可以选择小球、形状和线以及对应识别颜色。
     */
    //% blockGap=8
    //% blockId=OnToggle1 block="OnToggle1| %Col|%Fun"
    export function OnToggle1(Col: ColorID, Fun: FunctionID1): void {
        let i = 0
        if (Fun == 2) {
            ColID = Col
        }
        ShaColID = Col
        FunID = Fun
        IRecognitionSettings()
        IRecognitionSettings()
        while (1) {
            if (Identify_receive() == 1 || (i++) < 10)
                return
        }
    }

    //OnToggle2 开启/切换(巡线)
    /**
     * IODO:Turn on the settings graphic recognition function to identify red or black lines.
     * IODO:开启设置图形识别功能，进行红色线或者黑色线的识别。
     */
    //% blockGap=8
    //% blockId=OnToggle2 block="OnToggle2| %Col|Line"
    export function OnToggle2(Col: ColorLineID): void {
        let i = 0
        Line_ColID = Col
        FunID = 0x03
        IRecognitionSettings()
        IRecognitionSettings()
        while (1) {
            if (Identify_receive() == 1 || (i++) < 10)
                return
        }
    }

    //TogetherOn 开启/切换巡线+形状同是识别
    /**
     * IODO:Turn on the graphic recognition function to identify the line and its color, and at the same time identify the shape and its color.
     * IODO:开启设置图形识别功能，进行巡线及其颜色的识别，同时有形状及其颜色的识别。
     */
    //% blockGap=8
    //% blockId=TogetherOn block="TogetherOn| %Col|Line|%Col2|Shape"
    export function TogetherOn(Col1: ColorLineID, Col2: ColorID): void {
        let i = 0
        Line_ColID = Col1
        ShaColID = Col2
        FunID = 0x06
        IRecognitionSettings()
        IRecognitionSettings()
        while (1) {
            if (Identify_receive() == 1 || (i++) < 10)
                return
        }
    }

    //TogetherOn 开启/切换巡线+颜色同是识别
    /**
     * IODO:Turn on the setting pattern recognition function, which can perform line inspection and color recognition at the same time.
     * IODO:开启设置图形识别功能，同时进行巡线以及颜色识别。
     */
    //% blockGap=8
    //% blockId=TogetherOn1 block="TogetherOn1| %Col|Line|and color recognition"
    export function TogetherOn1(Col1: ColorLineID): void {
        let i = 0
        Line_ColID = Col1
        FunID = 0x07
        IRecognitionSettings()
        IRecognitionSettings()
        while (1) {
            if (Identify_receive() == 1 || (i++) < 10)
                return
        }
    }

    //TogetherOn 开启/切换巡线+AprilTag同时识别
    /**
     * IODO:Enable setting pattern recognition function, and perform line patrol and AprilTag label recognition at the same time.
     * IODO:开启设置图形识别功能，同时进行巡线以及AprilTag标签识别。
     */
    //% blockGap=8
    //% blockId=TogetherOn2 block="TogetherOn2| %Col|Line|and AprilTag"
    export function TogetherOn2(Col1: ColorLineID): void {
        let i = 0
        Line_ColID = Col1
        FunID = 0x08
        IRecognitionSettings()
        IRecognitionSettings()
        while (1) {
            if (Identify_receive() == 1 || (i++) < 10)
                return
        }
    }


    //###Tag code position return value||标签位置返回值
    /**
    * IODO:Returns the position value of the Tag code set, flips the corresponding position of the X, Y, and Z axes, and the flip angle of the X, Y, and Z axes.
    * IODO:返回Tag码集的位置值，翻转X、Y、Z轴对应位置及X、Y、Z轴的翻转角度。
    */
    //% blockGap=8
    //% blockId=sensor_Tag_return block="Tag code position return value| %data"
    export function Tag_return(data: Position): number {
        Identify_send()
        Identify_receive()
        switch (data) {
            case Position.Content_V: return ReturnData.Identify_pattern; break;
            case Position.X_axis: return ReturnData.Identify_x; break;
            case Position.Y_axis: return ReturnData.Identify_x; break;
            case Position.Z_axis: return ReturnData.Identify_x; break;
            case Position.X_flip: return ReturnData.Identify_x; break;
            case Position.Y_flip: return ReturnData.Identify_x; break;
            case Position.Z_flip: return ReturnData.Identify_x; break;
            default: return 255
        }
    }



    //###Ball return value||小球返回值
    /**
    * IODO:Returns the position information of the ball. Recognition status 1 indicates recognized, 0 indicates unrecognized; the X and Y axis positions of the center of the pellet in the image; the XY two-dimensional width and height of the pellet; and the recognition effect (the higher the recognition effect, the closer the sphere is). Return value type: int.
    * IODO:返回小球的位置信息。识别状态1表示已识别，0表示未识别；图像中小球中心的X、Y轴位置；小球的XY二维宽高，以及识别效果（识别效果越高，小球的距离越近）。返回值类型：int。
    */
    //% blockGap=8
    //% blockId=sensor_Ball_return block="Ball returnvalue| %P"
    export function Ball_return(P: Ball_Position): number {
        Identify_send()
        Identify_receive()
        switch (P) {
            case Ball_Position.status: return ReturnData.Ball_status
            case Ball_Position.X_axis: return ReturnData.Ball_X
            case Ball_Position.Y_axis: return ReturnData.Ball_Y
            case Ball_Position.Width: return ReturnData.Ball_W
            case Ball_Position.Depth: return ReturnData.Ball_H
            case Ball_Position.Re_effect: return ReturnData.Ball_pixels
            default: return 255
        }

    }

    //###Line patrol return||巡线返回
    /**
    * IODO:Robot line patrol status returns (0: not recognized to line, 1: recognized to line). Recognition effect: The pixel value of the recognition line is 0-19200, the deviation angle range (-90 ° ~ 90 °), the deviation X axis position range (- 160 ~ 160).
    * IODO:机器人巡线状态返回（0：未识别到线，1：识别到线）。识别效果：识别线像素值大小为0-19200，偏差角度范围（-90°~90°），偏差 X 轴位置 范围(- 160~160) 。
    */
    //% blockGap=8
    //% blockId=sensor_Line_return block="Line patrol return value| %x"
    export function Line_return(X: Line_Position): number {
        Identify_send()
        Identify_receive()
        switch (X) {
            case Line_Position.status: return ReturnData.Line_detect;
            case Line_Position.Re_effect: return ReturnData.Line_effect;
            case Line_Position.De_angle: return ReturnData.Line_angle;
            case Line_Position.De_position: return ReturnData.Line_position;
            default: return 255
        }
    }

    //###ColorRecognitionreturn||颜色返回
    /**
    * IODO:The robot recognizes the color and returns a 16-bit number. (1: red, 2: blue, 3: both red and black, 4: yellow, 5: both red and yellow, 6: both yellow and blue, 7: red, blue and yellow at the same time, 8: green, 9: both red and green)
    * IODO:机器人识别颜色并返回16bit数字。（1：红色，2：蓝色，3：同时有红色和黑色，4：黄色，5：同时有红色和黄色，6：同时有黄色和蓝色，7：同时有红蓝黄三色，8：绿色，9：同时有红色和绿色）
    * 
    */
    //% blockGap=8
    //% blockId=ColorRecognition block="Color Recognition return value"
    export function Colorreturn(): number {
        let i = 0
        Identify_send()
        Identify_receive()
        //while(1){
        //	Identify_send()
        //	if(Identify_receive() == 2 || (i++)>10)
        //		break
        //}    
        return ReturnData.Color_ID;
    }

    //###ShapeRecognitionreturn||形状返回
    /**
    * IODO:The robot recognizes the shape and returns a numeric range of 0 to 3. (0: None:, 1: Triangle, 2: Rectangle, 3: Circle)
    * IODO:机器人识别形状并返回0~3的数字范围。（0：无：，1：三角形，2：矩形，3：圆形）
    */
    //% blockGap=8
    //% blockId=ShapeRecognition block="shape recognition returns"
    export function Shapereturn(): number {
        Identify_send()
        Identify_receive()
        return ReturnData.Shapes_ID;
    }




    //########################################################################################################
    //#######################################CRC #############################################################
    let aucCRCHi = [0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
        0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
        0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x00, 0xC1, 0x81, 0x40,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40, 0x01, 0xC0, 0x80, 0x41, 0x01, 0xC0, 0x80, 0x41,
        0x00, 0xC1, 0x81, 0x40]
    let aucCRCLo = [0x00, 0xC0, 0xC1, 0x01, 0xC3, 0x03, 0x02, 0xC2, 0xC6, 0x06, 0x07, 0xC7,
        0x05, 0xC5, 0xC4, 0x04, 0xCC, 0x0C, 0x0D, 0xCD, 0x0F, 0xCF, 0xCE, 0x0E,
        0x0A, 0xCA, 0xCB, 0x0B, 0xC9, 0x09, 0x08, 0xC8, 0xD8, 0x18, 0x19, 0xD9,
        0x1B, 0xDB, 0xDA, 0x1A, 0x1E, 0xDE, 0xDF, 0x1F, 0xDD, 0x1D, 0x1C, 0xDC,
        0x14, 0xD4, 0xD5, 0x15, 0xD7, 0x17, 0x16, 0xD6, 0xD2, 0x12, 0x13, 0xD3,
        0x11, 0xD1, 0xD0, 0x10, 0xF0, 0x30, 0x31, 0xF1, 0x33, 0xF3, 0xF2, 0x32,
        0x36, 0xF6, 0xF7, 0x37, 0xF5, 0x35, 0x34, 0xF4, 0x3C, 0xFC, 0xFD, 0x3D,
        0xFF, 0x3F, 0x3E, 0xFE, 0xFA, 0x3A, 0x3B, 0xFB, 0x39, 0xF9, 0xF8, 0x38,
        0x28, 0xE8, 0xE9, 0x29, 0xEB, 0x2B, 0x2A, 0xEA, 0xEE, 0x2E, 0x2F, 0xEF,
        0x2D, 0xED, 0xEC, 0x2C, 0xE4, 0x24, 0x25, 0xE5, 0x27, 0xE7, 0xE6, 0x26,
        0x22, 0xE2, 0xE3, 0x23, 0xE1, 0x21, 0x20, 0xE0, 0xA0, 0x60, 0x61, 0xA1,
        0x63, 0xA3, 0xA2, 0x62, 0x66, 0xA6, 0xA7, 0x67, 0xA5, 0x65, 0x64, 0xA4,
        0x6C, 0xAC, 0xAD, 0x6D, 0xAF, 0x6F, 0x6E, 0xAE, 0xAA, 0x6A, 0x6B, 0xAB,
        0x69, 0xA9, 0xA8, 0x68, 0x78, 0xB8, 0xB9, 0x79, 0xBB, 0x7B, 0x7A, 0xBA,
        0xBE, 0x7E, 0x7F, 0xBF, 0x7D, 0xBD, 0xBC, 0x7C, 0xB4, 0x74, 0x75, 0xB5,
        0x77, 0xB7, 0xB6, 0x76, 0x72, 0xB2, 0xB3, 0x73, 0xB1, 0x71, 0x70, 0xB0,
        0x50, 0x90, 0x91, 0x51, 0x93, 0x53, 0x52, 0x92, 0x96, 0x56, 0x57, 0x97,
        0x55, 0x95, 0x94, 0x54, 0x9C, 0x5C, 0x5D, 0x9D, 0x5F, 0x9F, 0x9E, 0x5E,
        0x5A, 0x9A, 0x9B, 0x5B, 0x99, 0x59, 0x58, 0x98, 0x88, 0x48, 0x49, 0x89,
        0x4B, 0x8B, 0x8A, 0x4A, 0x4E, 0x8E, 0x8F, 0x4F, 0x8D, 0x4D, 0x4C, 0x8C,
        0x44, 0x84, 0x85, 0x45, 0x87, 0x47, 0x46, 0x86, 0x82, 0x42, 0x43, 0x83,
        0x41, 0x81, 0x80, 0x40]

    //CRC check
    function usMBCRC16(pucFrame: any, usLen: number) {
        // serial.writeNumber(usLen)
        // serial.writeBuffer(pucFrame)
        let Data_1 = pins.createBuffer(30)
        let Data_2 = pins.createBuffer(2)
        let Data_3
        let usLen_1 = usLen
        Data_1 = pucFrame
        let ucCRCHi = 0xFF
        let ucCRCLo = 0xFF
        let iIndex, i = 0
        while (usLen_1--) {
            iIndex = (ucCRCLo ^ Data_1[i++])
            ucCRCLo = (ucCRCHi ^ aucCRCHi[iIndex])
            ucCRCHi = aucCRCLo[iIndex]
        }
        Data_3 = ucCRCHi << 8 | ucCRCLo
        CRC_L = Data_3 >> 8
        CRC_H = Data_3 & 0x00ff
        CRC_tx_L = Data_3 >> 8
        CRC_tx_H = Data_3 & 0x00ff

    }

    //CRC check
    function usMBCRC161(pucFrame: any, usLen: number) {
        // serial.writeNumber(usLen)
        // serial.writeBuffer(pucFrame)
        let Data_1 = pins.createBuffer(80)
        let Data_2 = pins.createBuffer(2)
        let Data_3
        let usLen_1 = usLen
        Data_1 = pucFrame
        let ucCRCHi = 0xFF
        let ucCRCLo = 0xFF
        let iIndex = 0
        let i = 1
        while (usLen > 1) {
            usLen--
            iIndex = (ucCRCLo ^ Data_1[i++])
            ucCRCLo = (ucCRCHi ^ aucCRCHi[iIndex])
            ucCRCHi = aucCRCLo[iIndex]
        }
        Data_3 = ucCRCHi << 8 | ucCRCLo
        CRC_L = Data_3 >> 8
        CRC_H = Data_3 & 0x00ff
        CRC_tx_L1 = Data_3 >> 8
        CRC_tx_H1 = Data_3 & 0x00ff

    }

    //CRC data conversion
    function Data_conversion(data1: number, data2: number): number {
        let data3
        let data4 = 0xFFFF
        if (data1 > 0x7F) {
            data3 = ((data1 << 8 | data2) - 1) ^ data4
            return -data3
        }
        else {
            data3 = (data1 << 8) | data2
            return data3
        }

    }
}