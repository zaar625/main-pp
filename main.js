//스크롤 이벤트
(()=>{
    let yOffset = 0; 
    let prevScrollHeight = 0;
    let currentScene = 0;
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true
    // section info
    let delayedYOffset = 0;
    let acc = 0.1;//가속도
    let rafId;
	let rafState;


    const sectionInfo = [
        {
            //section1
            scrollHeight:0,
            heightNum:6,
            objs:{//조작할 돔 객체 모음
                container: document.querySelector(".section1"),
                centerMessage: document.querySelector('.section1-wrap .Main-title'),
                subMessage:document.querySelector('.section1-wrap p'),
                // 메인이미지 4개
                imageTransition1:document.querySelector('.sec1-image1'),
                imageTransition2:document.querySelector('.sec1-image2'),
                imageTransition3:document.querySelector('.sec1-image3'),
                imageTransition4:document.querySelector('.sec1-image4'),
                // about 이미지
                imagetransY:document.querySelector('.about_me')
            },
            values:{//[시작값,끝값,{구간}]
                centerMessage_translateX_in:[0,-120, {start: 0, end:0.6}],
                centerMessage_opacity_in:[1,0,{start: 0, end:0.6}],
                subMessage_opacity:[1,0,{start:0.1, end: 0.3}],

                // image1_opacity:[1,0,{start:0.5,end:0.65}],
                image1_transition_rotate_r:[0,20,{start:0,end:0.25}],
                image1_transition_rotate_l:[20,0,{start:0.25,end:0.5}],
                image1_transition_top:[10,49.9,{start:0,end:0.5}], 
                image1_transition_right:[8,49.9,{start:0,end:0.5}],

                image2_transition_top:[38,49.9,{start:0,end:0.5}], 
                image2_transition_right:[0,49.9,{start:0,end:0.5}],
                image2_transition_rotate_r:[0,15,{start:0,end:0.25}],
                image2_transition_rotate_l:[15,0,{start:0.25,end:0.5}],

                image3_transition_top:[20,49.9,{start:0,end:0.5}], 
                image3_transition_right:[20,49.9,{start:0,end:0.5}],
                image3_transition_rotate_r:[0,30,{start:0,end:0.25}],
                image3_transition_rotate_l:[30,0,{start:0.25,end:0.5}],

                image4_transition_top:[48,49.9,{start:0,end:0.5}], 
                image4_transition_right:[13,49.9,{start:0,end:0.5}],
                image4_transition_rotate_r:[0,8,{start:0,end:0.25}],
                image4_transition_rotate_l:[8,0,{start:0.25,end:0.5}],


                image_transform_center:[0,50,{start:0,end:0.5}],
                
                image_transition_Y:[100,0,{start:0.6,end:0.7}]
            }
        },
        {
            //section2
            scrollHeight:0,
            heightNum:9,
            objs:{//조작할 돔 객체 모음
                container: document.querySelector(".section2"),
                canvas:document.querySelector('#canvas-0'),
                context:document.querySelector('#canvas-0').getContext('2d'),
                videoImages:[],
                main_tit_box:document.querySelector('.sec2-main-tit'),
                main_title1:document.querySelector('.sec2-main-tit h3'),
                main_title2:document.querySelector('.sec2-main-tit .tit-num1'),
                main_title3:document.querySelector('.sec2-main-tit .tit-num2'),
            },
            values:{
                videoImageCount:87,//이미지 개수
                imageSequence:[0,86,{start:0.65, end:0.9}],//이미지 순서

                main_title1_opacity_in:[0,1,{start:0.2, end:0.3}],
                main_title1_translateY:[-40,-55,{start:0.2, end:0.3}],
                main_title2_opacity_in:[0,1,{start:0.3, end:0.4}],
                main_title2_translateY:[-40,-55,{start:0.3, end:0.4}],
                main_title3_opacity_in:[0,1,{start:0.4, end:0.5}],
                main_title3_translateY:[-40,-55,{start:0.4, end:0.5}],
                main_tit_box_opacity:[1,0, {start:0.5, end:0.6}],
                main_tit_box_translateY:[-55,-65,{start:0.5, end:0.6}],
                
            }
        },
        {
            // section3
            scrollHeight:0,
            heightNum:7,
            objs:{//조작할 돔 객체 모음
                container: document.querySelector(".section3"),
                sec3_bg:document.querySelector('.sec3-bg'),
                sec3_pad:document.querySelector('.sec3-pad'),
                sec3_iphone:document.querySelector('.sec3-iphone'),
                sec3_mac:document.querySelector('.sec3-mac')
            },
            values:{
                sec3_bg_scale:[3.75,1,{start:0.3, end: 0.4}],
                sec3_bg_translateY:[0,-11,{start:0.3, end: 0.4}],
                sec3_mac_opacity:[0,1,{start:0.4, end: 0.5}],
                sec3_pad_translateX:[-35, 85, {start:0.5, end: 0.6}],
                sec3_iphone_translateY:[55, 30, {start:0.65, end: 0.7}],
                
            }
        }
    ]


    //canvas
    function setCanvasImage(){
        let imgElem;
        for (i = 0; i < sectionInfo[1].values.videoImageCount; i++){
            imgElem = new Image();
            imgElem.src = `./img/mac-mockup/large_${0000 + i}.jpg`;
            sectionInfo[1].objs.videoImages.push(imgElem);
        }
        // console.log(sectionInfo[1].objs.videoImages)
        console.log(imgElem)
    }
    setCanvasImage();

    //각 섹션의 스크롤 높이 세팅
    function setLayout(){
        for(let i = 0; i < sectionInfo.length; i ++){
            sectionInfo[i].scrollHeight = sectionInfo[i].heightNum * window.innerHeight;
            sectionInfo[i].objs.container.style.height = `${sectionInfo[i].scrollHeight}px`;
        }
        yOffset = window.pageYOffset;
        // 현재 보고있는 scene
        let totalScrollHeight = 0;
		for (let i = 0; i < sectionInfo.length; i++) {
			totalScrollHeight += sectionInfo[i].scrollHeight;
			if (totalScrollHeight >= yOffset) {
				currentScene = i;
				break;
            }
        }
        //캔버스 반응형
        const heightRatio = window.innerHeight /1000;
        // console.log(window.innerHeight)
        // console.log(heightRatio)
        sectionInfo[1].objs.canvas.style.transform = `scale(${heightRatio})`
    }


    function calcValues(values, currentYOffset){
        let rv;
        // 현재 씬(스크롤섹션)에서 스크롤된 범위의 비율
        const scrollHeight = sectionInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;

			if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
				rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYOffset < partScrollStart) {
				rv = values[0];
			} else if (currentYOffset > partScrollEnd) {
				rv = values[1];
			}
		} else {
			rv = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return rv;
    }
    
    // 현재 scene에서 스크롤된 범위를 비율로 구하기
    function playAnimation(){
        const objs = sectionInfo[currentScene].objs;
        const values = sectionInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sectionInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;
        console.log(scrollRatio)
        switch(currentScene){
            case 0:
                if(scrollRatio <=0.25){
                    objs.subMessage.style.opacity = calcValues(values.subMessage_opacity, currentYOffset);
                    // 이미지1
                    objs.imageTransition1.style.transform = `translate3d(${calcValues(values.image_transform_center, currentYOffset)}%,${-calcValues(values.image_transform_center, currentYOffset)}%,0) rotate(-${calcValues(values.image1_transition_rotate_r, currentYOffset)}deg)`
                    // 이미지2
                    objs.imageTransition2.style.transform = `translate3d(${calcValues(values.image_transform_center, currentYOffset)}%,${-calcValues(values.image_transform_center, currentYOffset)}%,0) rotate(-${calcValues(values.image2_transition_rotate_r, currentYOffset)}deg)`
                    // 이미지3
                    objs.imageTransition3.style.transform = `translate3d(${calcValues(values.image_transform_center, currentYOffset)}%,${-calcValues(values.image_transform_center, currentYOffset)}%,0) rotate(${calcValues(values.image3_transition_rotate_r, currentYOffset)}deg)`

                    objs.imageTransition4.style.transform = `translate3d(${calcValues(values.image_transform_center, currentYOffset)}%,${-calcValues(values.image_transform_center, currentYOffset)}%,0) rotate(${calcValues(values.image4_transition_rotate_r, currentYOffset)}deg)`

                }else if(scrollRatio >0.25 && scrollRatio <= 0.53 ){
                    //이미지1
                    objs.imageTransition1.style.transform = `translate3d(${calcValues(values.image_transform_center, currentYOffset)}%,${-calcValues(values.image_transform_center, currentYOffset)}%,0) rotate(-${calcValues(values.image1_transition_rotate_l, currentYOffset)}deg)`
                    //이미지2
                    objs.imageTransition2.style.transform = `translate3d(${calcValues(values.image_transform_center, currentYOffset)}%,${-calcValues(values.image_transform_center, currentYOffset)}%,0) rotate(-${calcValues(values.image2_transition_rotate_l, currentYOffset)}deg)`

                    objs.imageTransition3.style.transform = `translate3d(${calcValues(values.image_transform_center, currentYOffset)}%,${-calcValues(values.image_transform_center, currentYOffset)}%,0) rotate(${calcValues(values.image3_transition_rotate_l, currentYOffset)}deg)`

                    objs.imageTransition4.style.transform = `translate3d(${calcValues(values.image_transform_center, currentYOffset)}%,${-calcValues(values.image_transform_center, currentYOffset)}%,0) rotate(${calcValues(values.image4_transition_rotate_l, currentYOffset)}deg)`
                }

                if(scrollRatio <= 0.54){
                    objs.imageTransition1.style.top = `${calcValues(values.image1_transition_top, currentYOffset)}%`

                    objs.imageTransition1.style.right = `${calcValues(values.image1_transition_right, currentYOffset)}%`

                    objs.imageTransition2.style.top = `${calcValues(values.image2_transition_top, currentYOffset)}%`

                    objs.imageTransition2.style.right = `${calcValues(values.image2_transition_right, currentYOffset)}%`

                    objs.imageTransition3.style.top = `${calcValues(values.image3_transition_top, currentYOffset)}%`

                    objs.imageTransition3.style.right = `${calcValues(values.image3_transition_right, currentYOffset)}%`

                    objs.imageTransition4.style.top = `${calcValues(values.image4_transition_top, currentYOffset)}%`

                    objs.imageTransition4.style.right = `${calcValues(values.image4_transition_right, currentYOffset)}%`

                    document.querySelector('.intro-wrap').classList.remove('intro-show')
                    
                }else if (scrollRatio >0.54 && scrollRatio <= 0.7){
                    objs.imageTransition1.style.opacity = calcValues(values.image1_opacity, currentYOffset);
                    document.querySelector('.intro-wrap').classList.add('intro-show')

                    objs.imagetransY.style.top = `${calcValues(values.image_transition_Y, currentYOffset)}%`
                }else {
                    document.querySelector('.intro-wrap').classList.remove('intro-show')
                }
            
            
                if(scrollRatio <= 0.7){
                    objs.centerMessage.style.opacity = calcValues(values.centerMessage_opacity_in, currentYOffset);
                    objs.centerMessage.style.transform = `translate3d(${calcValues(values.centerMessage_translateX_in, currentYOffset)}%, 0, 0)`;
                }
                if(scrollRatio >= 0.85){
                    document.querySelector('.intro-wrap').classList.remove('intro-show')
                    document.querySelector('.introImage-wrap').style.display = 'none'
                }else if(scrollRatio < 0.85){
                    document.querySelector('.introImage-wrap').style.display = 'block'
                }
                break;

            case 1:
                if(scrollRatio >= 0.22){
                    //메인타이틀 인터렉션
                    objs.main_title1.style.opacity = calcValues(values.main_title1_opacity_in, currentYOffset);
                    
                    objs.main_title1.style.transform = `translateY(${calcValues(values.main_title1_translateY, currentYOffset)}%)` 
                }
                if(scrollRatio >=0.32){
                    objs.main_title2.style.opacity = calcValues(values.main_title2_opacity_in, currentYOffset);            
                    
                    objs.main_title2.style.transform = `translateY(${calcValues(values.main_title2_translateY, currentYOffset)}%)` 
                }
                if(scrollRatio >=0.42){
                    objs.main_title3.style.opacity = calcValues(values.main_title3_opacity_in, currentYOffset);            
                    
                    objs.main_title3.style.transform = `translateY(${calcValues(values.main_title3_translateY, currentYOffset)}%)` 
                }
                if(scrollRatio >=0.5){
                    objs.main_tit_box.style.opacity = calcValues(values.main_tit_box_opacity, currentYOffset);            
                    
                    objs.main_tit_box.style.transform = `translateY(-50%, ${calcValues(values.main_tit_box_translateY, currentYOffset)}%)` 
                }
                if(scrollRatio >= 0.84){
                    document.querySelector('.react-box').classList.add('reactshow');
                    document.querySelector('.vue-box').classList.add('vueshow');
                }
           
                if(scrollRatio >=0.65 && scrollRatio <= 0.9){
                    let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                    objs.context.drawImage(objs.videoImages[sequence],0,0)
                }
            case 2:    
                if(scrollRatio >= 0.3){
                    objs.sec3_bg.style.transform = `translateY(${calcValues(values.sec3_bg_translateY, currentYOffset)}px) scale(${calcValues(values.sec3_bg_scale, currentYOffset)})`
                }
                if(scrollRatio >= 0.42 && scrollRatio <= 0.52 ){
                    objs.sec3_mac.style.opacity = calcValues(values.sec3_mac_opacity, currentYOffset)
                }
                if(scrollRatio >= 0.52 && scrollRatio <= 0.62){
                    objs.sec3_pad.style.transform = `translateX(${calcValues(values.sec3_pad_translateX, currentYOffset)}%)`
                    document.querySelector('.bg').classList.add('device-fillter-show')
                    document.querySelector('.sec3-mac').classList.add('device-fillter-show')
                }
                if(scrollRatio > 0.65 && scrollRatio <= 0.72){
                    objs.sec3_iphone.style.top = `${calcValues(values.sec3_iphone_translateY, currentYOffset)}%`
                    document.querySelector('.sec3-pad').classList.add('device-fillter-show')
                }
            }
// translateY(${calcValues(values.sec3_bg_translateY, currentYOffset)}%)
    }
    function scrollLoop(){
        enterNewScene = false;
        prevScrollHeight = 0; //값이 쌓이는 걸 방지하기 위해 초기화
        
        for (let i = 0; i < currentScene; i++){
            prevScrollHeight += sectionInfo[i].scrollHeight
        }
        
        if(delayedYOffset > prevScrollHeight + sectionInfo[currentScene].scrollHeight){
            enterNewScene = true;
            currentScene++;
        }

        if(delayedYOffset < prevScrollHeight){
            if(currentScene === 0) return//브라우저 바운스효과로(마이너스)가 되는것을 방지(모바일)
            enterNewScene = true;
            currentScene--;
        }
        if (enterNewScene) return;
        playAnimation();
    }
    //부드러운 감속효과
    function loop(){
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
        // console.log(delayedYOffset)
        if (delayedYOffset < 1) {
            scrollLoop();
        }

        rafId = requestAnimationFrame(loop);

        if (Math.abs(yOffset - delayedYOffset) < 1) {
			cancelAnimationFrame(rafId);
			rafState = false;
		}
    }

    window.addEventListener('load',()=>{
        setLayout();

        //캔번스 미리 그리기
        sectionInfo[1].objs.context.drawImage(sectionInfo[1].objs.videoImages[0], 0, 0);
        
        // 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
        let tempYOffset = yOffset;
        let tempScrollCount = 0;
        if (tempYOffset > 0) {
            //setintervalId
            let siId = setInterval(() => {
                scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if (tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }
        
        //scroll event
        window.addEventListener('scroll',()=>{
            yOffset = parseInt(window.pageYOffset);
            scrollLoop();

            if (!rafState) {
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
            // console.log(yOffset, currentScene);
            
        });
    })
    window.addEventListener('resize', setLayout)
})();