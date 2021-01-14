(rjs, params) => {
	
	// использоваие SAT.js для просчёта пересечений объектов
	rjs.Collision = function (a, b) {
		
		let _a_vert;
		let _b_vert;
		
		if(a.type == 'polygon') {
			_a_vert = a.vertices;
		}
		else if(a.type == 'sprite') {
			let w = a.size.x/2;
			let h = a.size.y/2;
			_a_vert = [
				vec2(-w, -h),
				vec2(w, -h),
				vec2(w, h),
				vec2(-w, h)
			];
		}
		else {
			return false;
		}
		
		if(b.type == 'polygon') {
			_b_vert = b.vertices;
		}
		else if(b.type == 'sprite') {
			let w = b.size.x/2;
			let h = b.size.y/2;
			_b_vert = [
				vec2(-w, -h),
				vec2(w, -h),
				vec2(w, h),
				vec2(-w, h)
			];
		}
		else {
			return false;
		}
		
		const a_vert = [];
		const b_vert = [];
		
		for(let i in _a_vert) {
			a_vert[i] = vec2(_a_vert[i].x * a.scale.x, _a_vert[i].y * a.scale.y);
		}
		
		for(let i in _b_vert) {
			b_vert[i] = vec2(_b_vert[i].x * b.scale.x, _b_vert[i].y * b.scale.y);
		}
		
		const a_polygon = new SAT.Polygon(a.pos, a_vert);
		const b_polygon = new SAT.Polygon(b.pos, b_vert);
		
		a_polygon.translate(-a.origin.x*a.scale.x, -a.origin.y*a.scale.y);
		b_polygon.translate(-b.origin.x*b.scale.x, -b.origin.y*b.scale.y);
		
		a_polygon.setAngle(a.angle * Math.PI / 180);
		b_polygon.setAngle(b.angle * Math.PI / 180);
		
		const res = new SAT.Response();
		
		const coll = SAT.testPolygonPolygon(a_polygon, b_polygon, res);
		
		if(coll)
			return res;
		return false;
		
	};

	rjs.collision = rjs.Collision;

	// получение bonding box'а
	rjs.getBoundingBox = function (o, calc_angle = true) {
		
		let vert;
		
		if(o.type == 'polygon') {
			vert = o.vertices;
		}
		else if(o.type == 'sprite') {
			let w = o.size.x*o.scale.x/2;
			let h = o.size.y*o.scale.y/2;
			vert = [
				vec2(-w, -h),
				vec2(w, -h),
				vec2(w, h),
				vec2(-w, h)
			];
		}
		else {
			return false;
		}
		
		if(calc_angle) {
			let vert2 = [];
			for(let i in vert) {
				let v = vert[i];
				let a = o.angle * Math.PI / 180;
				let cos = Math.cos(a);
				let sin = Math.sin(a);
				let c = o.origin;
				let vx = (v.x*o.scale.x) - c.x;
				let vy = (v.y*o.scale.y) - c.y;
				let x = vx * cos - vy * sin;
				let y = vx * sin + vy * cos;
				vert2.push(vec2(x, y));
			}
			vert = vert2;
		}
		
		let minX = 0,
			minY = 0,
			maxX = 0,
			maxY = 0;
		
		for(let i in vert) {
			let x = vert[i].x;
			let y = vert[i].y;
			if(x < minX)
				minX = x;
			if(x > maxX)
				maxX = x;
			if(y < minY)
				minY = y;
			if(y > maxY)
				maxY = y;
		}
		
		return {
			x1: minX+o.pos.x,
			y1: minY+o.pos.y,
			x2: maxX+o.pos.x,
			y2: maxY+o.pos.y
		};
		
	};

	// пересечение двух bounding box'ов
	
	rjs.AABB = function (a, b) {
		return (
			a.x1 < b.x2 &&
			a.y1 < b.y2 &&
			a.x2 > b.x1 &&
			a.y2 > b.y1
		);
	};
	
	return true;
	
}