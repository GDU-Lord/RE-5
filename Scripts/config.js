() => {

	// this script executes after engine initialization
	// there's all project configurations and settings

	// settings for RectJS.renderer
	// it sets renderer to PATTERN OPTIMIZATION MODE (recomended)
	// and switched off CHUNKS OPTIMIZATION MODE (recomended for scenes with lots of objects out of screen)
	rjs.renderer.PATTERN_MODE = true;
	rjs.renderer.CHUNKS_MODE = false;

}