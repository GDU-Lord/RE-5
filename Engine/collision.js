(rjs, params) => {
	
	rjs.Collision = function (a, b) {
		
		var _a_vert;
		var _b_vert;
		
		if(a.type == 'polygon') {
			_a_vert = a.vertices;
		}
		else if(a.type == 'sprite') {
			var w = a.size.x/2;
			var h = a.size.y/2;
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
			var w = b.size.x/2;
			var h = b.size.y/2;
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
		
		var a_vert = [];
		var b_vert = [];
		
		for(var i in _a_vert) {
			a_vert[i] = vec2(_a_vert[i].x * a.scale.x, _a_vert[i].y * a.scale.y);
		}
		
		for(var i in _b_vert) {
			b_vert[i] = vec2(_b_vert[i].x * b.scale.x, _b_vert[i].y * b.scale.y);
		}
		
		
		var a_polygon = new SAT.Polygon(a.pos, a_vert);
		var b_polygon = new SAT.Polygon(b.pos, b_vert);
		
		a_polygon.translate(-a.origin.x*a.scale.x, -a.origin.y*a.scale.y);
		b_polygon.translate(-b.origin.x*b.scale.x, -b.origin.y*b.scale.y);
		
		a_polygon.setAngle(a.angle * Math.PI / 180);
		b_polygon.setAngle(b.angle * Math.PI / 180);
		
		var res = new SAT.Response();
		
		var coll = SAT.testPolygonPolygon(a_polygon, b_polygon, res);
		
		if(coll)
			return res;
		return false;
		
	};

	rjs.collision = rjs.Collision;
	
	rjs.getBoundingBox = function (o, calc_angle = true) {
		
		var vert;
		
		if(o.type == 'polygon') {
			vert = o.vertices;
		}
		else if(o.type == 'sprite') {
			var w = o.size.x*o.scale.x/2;
			var h = o.size.y*o.scale.y/2;
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
			var vert2 = [];
			for(var i in vert) {
				var v = vert[i];
				var a = o.angle * Math.PI / 180;
				var cos = Math.cos(a);
				var sin = Math.sin(a);
				var c = o.origin;
				var vx = (v.x*o.scale.x) - c.x;
				var vy = (v.y*o.scale.y) - c.y;
				var x = vx * cos - vy * sin;
				var y = vx * sin + vy * cos;
				vert2.push(vec2(x, y));
			}
			vert = vert2;
		}
		
		var minX = 0,
			minY = 0,
			maxX = 0,
			maxY = 0;
		
		for(var i in vert) {
			var x = vert[i].x;
			var y = vert[i].y;
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