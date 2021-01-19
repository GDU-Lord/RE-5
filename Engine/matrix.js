() => {
    class M3 {

        constructor () {
            
        }

        identity (m) {
            // return new Float32Array([
            //     1, 0, 0,
            //     0, 1, 0,
            //     0, 0, 1,
            // ]);
            m[0] = 1;
            m[4] = 1;
            m[8] = 1;
            return m;
        }

        translation (m, tx, ty) {
            const mat = [
                1, 0, 0,
                0, 1, 0,
                tx, ty, 1,
            ];
            return this.multiply(mat, m);
        }

        rotation (m, angle) {
            const angleInRadians = -angle / 180 * Math.PI;
            const c = Math.cos(angleInRadians);
            const s = Math.sin(angleInRadians);
            const mat = [
                c, -s, 0,
                s, c, 0,
                0, 0, 1,
            ];
            return this.multiply(mat, m);
        }

        scaling (m, sx, sy) {
            const mat = [
                sx, 0, 0,
                0, sy, 0,
                0, 0, 1,
            ];
            return this.multiply(mat, m);
        }

        multiply (a, b) {
            const a00 = a[0 * 3 + 0];
            const a01 = a[0 * 3 + 1];
            const a02 = a[0 * 3 + 2];
            const a10 = a[1 * 3 + 0];
            const a11 = a[1 * 3 + 1];
            const a12 = a[1 * 3 + 2];
            const a20 = a[2 * 3 + 0];
            const a21 = a[2 * 3 + 1];
            const a22 = a[2 * 3 + 2];
            const b00 = b[0 * 3 + 0];
            const b01 = b[0 * 3 + 1];
            const b02 = b[0 * 3 + 2];
            const b10 = b[1 * 3 + 0];
            const b11 = b[1 * 3 + 1];
            const b12 = b[1 * 3 + 2];
            const b20 = b[2 * 3 + 0];
            const b21 = b[2 * 3 + 1];
            const b22 = b[2 * 3 + 2];
            // return new Float32Array([
            //     b00 * a00 + b01 * a10 + b02 * a20,
            //     b00 * a01 + b01 * a11 + b02 * a21,
            //     b00 * a02 + b01 * a12 + b02 * a22,
            //     b10 * a00 + b11 * a10 + b12 * a20,
            //     b10 * a01 + b11 * a11 + b12 * a21,
            //     b10 * a02 + b11 * a12 + b12 * a22,
            //     b20 * a00 + b21 * a10 + b22 * a20,
            //     b20 * a01 + b21 * a11 + b22 * a21,
            //     b20 * a02 + b21 * a12 + b22 * a22,
            // ]);
            b[0] = b00 * a00 + b01 * a10 + b02 * a20;
            b[1] = b00 * a01 + b01 * a11 + b02 * a21;
            b[2] = b00 * a02 + b01 * a12 + b02 * a22;
            b[3] = b10 * a00 + b11 * a10 + b12 * a20;
            b[4] = b10 * a01 + b11 * a11 + b12 * a21;
            b[5] = b10 * a02 + b11 * a12 + b12 * a22;
            b[6] = b20 * a00 + b21 * a10 + b22 * a20;
            b[7] = b20 * a01 + b21 * a11 + b22 * a21;
            b[8] = b20 * a02 + b21 * a12 + b22 * a22;
            return b;
        }
    }

    return new M3();
}