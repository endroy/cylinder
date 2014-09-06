var left = 0, right = 1, center = 2;
function cylinder_image() {
	var abs_offset_x = 0, abs_offset_y = 0;
	var img_node = null;
	var img_width = 0, img_height = 0;

    /*
    *   name: image url
    *   w: image width in pixel
    *   h: image height in pixel
    */

	this.init = function(name, w, h) {
        /*
        * set the div content here 
        *
        */
		var image = $('<img src="'+name+'" width="'+w+'" height="'+h+'"/>');
		img_node = $('<div class="cyn_image"></div>').append(image);
		img_width = w;
		img_height = h;
		return img_node;
	}

	this.moveBy = function(offset_x, offset_y) {
		abs_offset_x += offset_x;
		abs_offset_y += offset_y;
        /*
        *  set the actual animation css below
        */
		img_node.css('left', abs_offset_x + 'px');
	}

	this.testMe = function() {
		if (abs_offset_x <= 0 && (abs_offset_x + img_width) > 0) {
			var inme = true;
			var half = left;
			if (Math.abs(abs_offset_x) > Math.abs(abs_offset_x + img_width)) {
				half = right;
			}
			return {inme: inme, half: half, l: abs_offset_x, r: (abs_offset_x + img_width)};
		} else {
			return false;
		}
	}

	this.img_node = function() {
		return img_node;
	}

	this.abs_offset_x = function() {
		return abs_offset_x;
	}

	this.abs_offset_y = function() {
		return abs_offset_y;
	}
}

function cylinder_vew() {
	var cid = '';
	var image_name = '';
	var image_width = 0, image_height = 0;
	var view_anchorx = 0, view_anchory = 0;
	var cyn_images = [];

    /*
    *   containerID : document node id
    *   img_name:  image url
    *   w: image width in pixel
    *   h: image height in pixel
    */

	this.init = function(containerID, img_name, w, h) {
		cid = containerID;
		image_name = img_name;
		image_width = w;
		image_height = h;
		this.addImage(right, -image_width, 0);
        //this.moveViewBy(100);
	}

	this.addImage = function(half, offset_x, offset_y) {
		var ci = new cylinder_image;
		var cn = ci.init(image_name, image_width, image_height);
		switch(half) {
			case left: 
		    			ci.moveBy(offset_x - image_width);
						cyn_images.unshift(ci);
						break;
			case right: 
			    		ci.moveBy(offset_x + image_width);
						cyn_images.push(ci);
						break;
		}
		cn.appendTo('#'+cid);
	}

	this.removeImage = function(half) {
		switch(half) {
			case left : 
						cyn_images[0].img_node().remove();
						cyn_images.shift();
						break;
			case right : 
						cyn_images[cyn_images.length-1].img_node().remove();
						cyn_images.pop();
						break;
		}
	}

    /*
    *   diff_x  : the delta in x, positive for moving the view to the right, equal to moving the images to left
    *   diff_y  : the delat in y, positive for moving the view up, equal to moving the images down
    */

	this.moveViewBy = function(diff_x, diff_y) {
		var testcenter;
		view_anchorx += diff_x;
		view_anchory += diff_y;
		for (var i = cyn_images.length - 1; i >= 0; i--) {
			cyn_images[i].moveBy(-diff_x, -diff_y);
			console.log(cyn_images[i].abs_offset_x());
		}
		for (var i = cyn_images.length - 1; i >= 0; i--) {
			if (testcenter = cyn_images[i].testMe()) {
				console.log(i+ ':' + testcenter.l + ':' + testcenter.r);
				switch(testcenter.half) {
					case left : 
								// check if the image has left adjacent. skip if yes, create one and remove any right adjacent image if no.
								if (i < (cyn_images.length-1)) {
									this.removeImage(right);
									console.log('removed right');
								}
								if (i==0) {
									this.addImage(left, cyn_images[i].abs_offset_x(), cyn_images[i].abs_offset_y());
									console.log('added left');
								}
								break;
					case right: 
								// check if the image has right adjacent. skip if yes, create one and remove any left adjacnet image if no.
								if (i==(cyn_images.length-1)) {
									this.addImage(right, cyn_images[i].abs_offset_x(), cyn_images[i].abs_offset_y());
									console.log('added right');
								}
								if (i > 0) {
									this.removeImage(left);
									console.log('removed left');
								}
								break;
				}
			}
		}
	}

	this.getImages = function() {
		return cyn_images;
	}
}
