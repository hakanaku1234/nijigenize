export default function calculateWorker(): void {
    const BLINK_JUDGEMENT_THRESHOLD = 0.04;

    function getDistance2(position: number[][], a: number, b: number): number {
        return Math.pow(position[a][0] - position[b][0], 2) + Math.pow(position[a][1] - position[b][1], 2);
    }

    function isAboveAB(position: number[][], a: number, b: number, target: number): boolean {
        return (position[b][1] - position[target][1]) / (position[target][0] - position[b][0]) > (position[b][1] - position[a][1]) / (position[a][0] - position[b][0]);
    }

    function getRelativeEyeH(position: number[][], eye: number, fromEdge: number, toEdge: number): number {
        const edgeDistance2 = getDistance2(position, fromEdge, toEdge),
            eyeFromEdge2 = getDistance2(position, fromEdge, eye),
            eyeToEdge2 = getDistance2(position, eye, toEdge);
        return Math.sqrt(eyeFromEdge2 - Math.pow(eyeFromEdge2 - eyeToEdge2 + edgeDistance2, 2) / (4 * edgeDistance2)) * (isAboveAB(position, toEdge, fromEdge, eye) ? 1 : -1);
    }
    
    self.onmessage = (event) => {
      const { position, probableBlinkHeight, probableBlinkDiff } = <{
        position: number[][],
        probableBlinkHeight: number,
        probableBlinkDiff: number
      }>event.data;
      
        if (!position) {
            return;
        }
        const parameter: { [name: string]: number } = {},
            faceR = position[37][0] - position[2][0],
            faceL = position[12][0] - position[37][0],
            mouthH = position[57][1] - position[60][1],
            lipH = position[53][1] - position[57][1],
            eyeH = position[26][1] - position[24][1],
            relativeEyeHL = getRelativeEyeH(position, 27, 0, 33),
            relativeEyeHR = getRelativeEyeH(position, 32, 33, 14);
            
        let newProbableNoBlinkHeight: number = null, newProbableBlinkHeight: number = null;

        // eye open
        if (!probableBlinkDiff) {
            if (Math.abs(relativeEyeHL - relativeEyeHR) > eyeH * BLINK_JUDGEMENT_THRESHOLD) {
                if (relativeEyeHL > relativeEyeHR) {
                    parameter['PARAM_EYE_L_OPEN'] = 1;
                    parameter['PARAM_EYE_R_OPEN'] = 0;
                    newProbableNoBlinkHeight = relativeEyeHL;
                    newProbableBlinkHeight = relativeEyeHR;
                } else {
                    parameter['PARAM_EYE_L_OPEN'] = 0;
                    parameter['PARAM_EYE_R_OPEN'] = 1;
                    newProbableNoBlinkHeight = relativeEyeHR;
                    newProbableBlinkHeight = relativeEyeHL;
                }
            } else {
                parameter['PARAM_EYE_L_OPEN'] = 1;
                parameter['PARAM_EYE_R_OPEN'] = 1;
            }
        } else {
            parameter['PARAM_EYE_L_OPEN'] = (relativeEyeHL - probableBlinkHeight) / probableBlinkDiff;
            parameter['PARAM_EYE_R_OPEN'] = (relativeEyeHR - probableBlinkHeight) / probableBlinkDiff;
        }

        // face angle
        parameter['PARAM_ANGLE_X'] = Math.asin((faceL - faceR) / (faceL + faceR)) * (180 / Math.PI);
        parameter['PARAM_ANGLE_Y'] = Math.asin((position[0][1] + position[14][1] - position[27][1] - position[32][1]) * 2 / (position[14][0] - position[0][0])) * (180 / Math.PI);
        parameter['PARAM_ANGLE_Z'] = Math.atan((position[32][1] - position[27][1]) / (position[32][0] - position[27][0])) * (-180 / Math.PI);
        // mouth
        parameter['PARAM_MOUTH_OPEN_Y'] = mouthH / lipH - 0.5;
        parameter['PARAM_MOUTH_FORM'] = 2 * (position[50][0] - position[44][0]) / (position[30][0] - position[25][0]) - 1;
        // eye ball
        parameter['PARAM_EYE_BALL_X'] = (position[27][0] - position[23][0]) / (position[25][0] - position[23][0]) - 0.5;
        parameter['PARAM_EYE_BALL_Y'] = (position[27][1] - position[24][1]) / eyeH - 0.5;
        // eye brow
        parameter['PARAM_BROW_L_Y'] = 2 * (position[24][1] - position[21][1]) / lipH - 4;
        parameter['PARAM_BROW_R_Y'] = 2 * (position[29][1] - position[17][1]) / lipH - 4;

        (<any>self.postMessage)({ parameter, probableNoBlinkHeight: newProbableNoBlinkHeight, probableBlinkHeight: newProbableBlinkHeight });
    };
}