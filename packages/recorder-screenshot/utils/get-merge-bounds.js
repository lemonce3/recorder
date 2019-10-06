export function getMergeBounds(items) {
	let x = 0 , y = 0 , xe = 0, ye = 0;

	items.forEach(item => {
		if (item.bounds.x === xe) {
			xe = xe + item.bounds.width;
		}
		if (item.bounds.x < x) {
			x = item.bounds.x;
		}

		if (item.bounds.y === ye) {
			ye = ye + item.bounds.height;
		}

		if (item.bounds.y < y) {
			y = item.bounds.y;
		}
	});

	return {
		x, y,
		width: xe - x,
		height: ye -y
	};
}