(rjs) => {    
    // получение угла между двумя векторами

    class Vert {
        getAtan (a, b, c) {
            const A = vec2(a.x-c.x, a.y-c.y);
            const B = vec2(b.x-c.x, b.y-c.y);
            const a1 = Math.atan2(A.x, A.y) * 180 / Math.PI;
            const a2 = Math.atan2(B.x, B.y) * 180 / Math.PI;
            return a2 - a1;
        }

        // получение индекса последнего элеммента массива
        getN (vertList, n) {
            if(n >= vertList.length)
                n -= vertList.length;
            return n;
        }

        // получение вершины
        getVert (vertList, n) {
            n = this.getN(vertList, n);
            if(typeof vertList[n] != 'undefined')
                return vertList[n];
            else
                return this.getVert(vertList, n+1);
        }

        // получение идентификатора вершины
        getVertID (vertList, n) {
            n = this.getN(vertList, n);
            if(typeof vertList[n] != 'undefined')
                return n;
            this
                return this.getVertID(vertList, n+1);
        }

        // шаг разбиения фигуры на триугольники
        triStep (vertList, triList, n) {
            if(count(vertList) < 3)
                return;
            n = this.getN(vertList, n);
            if(typeof vertList[n] != 'undefined') {
                const A_ID = this.getVertID(vertList, n);
                const C_ID = this.getVertID(vertList, A_ID+1);
                const B_ID = this.getVertID(vertList, C_ID+1);
                const A = vertList[A_ID];
                const B = vertList[B_ID];
                const C = vertList[C_ID];
                const atan = this.getAtan(A, B, C);
                if(atan < 180) {
                    triList.push(A);
                    triList.push(B);
                    triList.push(C);
                    delete vertList[C_ID];
                }
            }
            n ++;
            this.triStep(vertList, triList, n);
        }

        // разбиение фигуры на триугольники
        triangulation (vertices = []) {

            const vertList = [];
            const indList = [];

            for(let i in vertices) {
                vertList[i] = vertices[i];
            }
            
            const triList = [];
            let n = 0;

            this.triStep(vertList, triList, n);

            for(let i in triList) {
                indList[i] = triList[i].index;
            }

            return indList;
            
        }

        // получение массива вершин
        getVerticesArray (o) {
            
            const vertices = [];
            let indices;
            
            let vert = o.vertices;

            for(let i in vert) {
                vert[i] = copy(vert[i]);
                vert[i].index = parseInt(i);
            }

            if(o.type == 'polygon') {
                indices = this.triangulation(vert);
            }
            
            for(let i = 0; i < vert.length; i ++) {
                vertices[i*2+0] = vert[i].x;
                vertices[i*2+1] = vert[i].y;
            }

            return {vertices: vertices, indices: indices};
            
        }

        // получение координат текстуры
        getUV_Array (o, vertices, texture = null) {
            
            const UV = [];
            
            const bb = this.getBoundingBox(vertices);

            if(texture == null || (texture.type != 'tiled' && texture.type != 'croped')) {
                for(let i = 0; i < vertices.length; i += 2) {
                    const x = (vertices[i] - bb.minX) / bb.w;
                    const y = (vertices[i+1] - bb.minY) / bb.h;
                    UV[i] = x;
                    UV[i+1] = y;
                }
            }
            else if(texture.type == 'tiled') {
                let mx = 1;
                let my = 1;
                if(o.type == 'sprite') {
                    mx = o.size.x;
                    my = o.size.y;
                    bb.minX *= mx;
                    bb.minY *= my;
                    bb.maxX *= mx;
                    bb.maxY *= my;
                    bb.w *= mx;
                    bb.h *= my;
                }
                const tx = typeof texture.size.x == 'number' ? texture.size.x : bb.w;
                const ty = typeof texture.size.y == 'number' ? texture.size.y : bb.h;
                const size = vec2(tx, ty);
                for(let i = 0; i < vertices.length; i += 2) {
                    const x = (vertices[i]*mx - bb.minX) / size.x;
                    const y = (vertices[i+1]*my - bb.minY) / size.y;
                    UV[i] = x;
                    UV[i+1] = y;
                }
            }

            else if(texture.type == 'croped') {
                for(let i = 0; i < vertices.length; i += 2) {
                    const x = ((vertices[i] - bb.minX) / bb.w + texture.pos.x / (texture.size.x)) / (texture.tex.canvas.width/texture.size.x);// + texture.pos.x / (texture.tex.image.width/texture.size.x)) / (texture.tex.image.width/texture.size.x);
                    const y = ((vertices[i+1] - bb.minY) / bb.h + texture.pos.y / (texture.size.y)) / (texture.tex.canvas.height/texture.size.y);// + texture.pos.y / (texture.tex.image.width/texture.size.x))  / (texture.tex.image.height/texture.size.y);
                    UV[i] = x;
                    UV[i+1] = y;
                }
            }
            
            return UV;
            
        }

        getBoundingBox (vertices) {
            let minX = vertices[0];
            let minY = vertices[1];
            let maxX = vertices[0];
            let maxY = vertices[1];
            for(let i = 0; i < vertices.length; i += 2) {
                if(vertices[i] < minX)
                    minX = vertices[i];
                if(vertices[i+1] < minY)
                    minY = vertices[i+1];
                if(vertices[i] > maxX)
                    maxX = vertices[i];
                if(vertices[i+1] > maxY)
                    maxY = vertices[i+1];
            }
            return {
                w: maxX - minX,
                h: maxY - minY,
                minX: minX,
                minY: minY,
                maxX: maxX,
                maxY: maxY
            };
        }

    }

    return new Vert();

}