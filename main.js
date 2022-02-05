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
            heightNum:5,
            objs:{//조작할 돔 객체 모음
                container: document.querySelector(".section1"),
                centerMessage: document.querySelector('.section1-wrap .Main-title'),
                imageTransition1:document.querySelector('.sec1-image1'),
                imageTransition2:document.querySelector('.sec1-image2'),
                imageTransition3:document.querySelector('.sec1-image3'),
                imageTransition4:document.querySelector('.sec1-image4'),
            },
            values:{//[시작값,끝값,{구간}]
                centerMessage_translateX_in:[0,-120, {start: 0, end:0.6}],
                centerMessage_opacity_in:[1,0,{start: 0, end:0.6}],
                
                image1_transition_top:[10,50,{start:0,end:0.3}], 
                image1_transition_right:[8,50,{start:0,end:0.3}],
                image1_transition_rotate_r:[0,24,{start:0,end:0.2}],
                image1_transition_rotate_1:[0,0,{start:0.2,end:0.3}],

                image2_transition_top:[38,50,{start:0,end:0.3}], 
                image2_transition_right:[0,50,{start:0,end:0.3}],
                
                image_transform_center:[0,50,{start:0,end:0.3}]  
            }
        },
        {
            //section2
            scrollHeight:0,
            heightNum:6,
            objs:{//조작할 돔 객체 모음
                container: document.querySelector(".section2"),
                canvas:document.querySelector('#canvas-0'),
                context:document.querySelector('#canvas-0').getContext('2d'),
                videoImages:[]
            },
            values:{
                videoImageCount:87,//이미지 개수
                imageSequence:[0,86],//이미지 순서
            }
        }
    ]


    //canvas
    function setCanvasImage(){
        let imgElem;
        for (i = 0; i < sectionInfo[1].values.videoImageCount; i++){
            imgElem = new Image();
            imgElem.src = `./img/macImage/large_${0000 + i}.jpg`;
            sectionInfo[1].objs.videoImages.push(imgElem);
        }
        console.log(sectionInfo[1].objs.videoImages)
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

        const heightRatio = window.innerHeight /1080;
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
        // console.log(scrollRatio)
        switch(currentScene){
            case 0:
                if(scrollRatio <= 0.22){
                    objs.imageTransition1.style.transform = `rotateX(${calcValues(values.image1_transition_rotate_r, currentYOffset)}deg)`
                }
                if(scrollRatio <= 0.42){
                    // image1
                    objs.imageTransition1.style.top = `${calcValues(values.image1_transition_top, currentYOffset)}%`

                    objs.imageTransition1.style.right = `${calcValues(values.image1_transition_right, currentYOffset)}%`

                    objs.imageTransition1.style.transform = `translate3d(${calcValues(values.image_transform_center, currentYOffset)}%,${-calcValues(values.image_transform_center, currentYOffset)}%,0) `
                    // image2
                    objs.imageTransition2.style.top = `${calcValues(values.image2_transition_top, currentYOffset)}%`

                    objs.imageTransition2.style.right = `${calcValues(values.image2_transition_right, currentYOffset)}%`

                    objs.imageTransition2.style.transform = `translate3d(${calcValues(values.image_transform_center, currentYOffset)}%,${-calcValues(values.image_transform_center, currentYOffset)}%,0)`


                    // console.log(objs.imageTransition.style.right,objs.imageTransition.style.transform )
                }
                if(scrollRatio <= 0.62){
                    objs.centerMessage.style.opacity = calcValues(values.centerMessage_opacity_in, currentYOffset);
                    objs.centerMessage.style.transform = `translate3d(${calcValues(values.centerMessage_translateX_in, currentYOffset)}%, 0, 0)`;
                }
               
                break;

            case 1:
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // console.log(sequence)
                objs.context.drawImage(objs.videoImages[sequence],0,0);
                console.log(objs.context.fillStyle)
                break;
        }

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