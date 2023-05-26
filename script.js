
////////////////////////////////////////////////////////////// ASYNC WRAPPER

(async () => {

  //////////////////////////////////////////////////////////// IMAGE LOADING FUNCTION

  const loadImage = path => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.src = path;
  });

  //////////////////////////////////////////////////////////// GLOBAL VARIABLES

  const canvas = document.querySelector('canvas');
  const c = canvas.getContext('2d', { willReadFrequently: true });
  const parts = [];
  let mouseDown = false;

  //////////////////////////////////////////////////////////// IMAGE VARIABLES

  const images = {
    richard: await loadImage('./assets/richard.png'),
    laser: await loadImage('./assets/laser.png'),
    chain: await loadImage('./assets/chain.png'),
    blunt: await loadImage('./assets/blunt.png'),
    pa: await loadImage('./assets/pa.png'),
    weed: await loadImage('./assets/weed.png'),
    rack: await loadImage('./assets/rack.png'),
    chair: await loadImage('./assets/chair.png')
  };
  const fallingImages = [images.weed, images.rack, images.chair];
  const fallingImageScales = [0.05, 0.1, 0.05];

  //////////////////////////////////////////////////////////// AUDIO VARIABLES

  const audio = new Audio('./assets/_jid.mp3');
  let audioContext = null;
  let audioSource = null;
  let analyser = null;
  let bufferLength = null;
  let dataArray = null;
  let barWidth = null;

  //////////////////////////////////////////////////////////// CLICK TO BEGIN SCENE

  const aa = () => {

    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    c.font = '50px monospace';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillStyle = 'black';
    c.fillText('Turn volume up and click anywhere...', canvas.width / 2, canvas.height / 2);

    if (mouseDown) {
      audioContext = new window.AudioContext();
      audio.play();
      audioSource = audioContext.createMediaElementSource(audio);
      analyser = audioContext.createAnalyser();
      audioSource.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 2048;
      bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
      barWidth = canvas.width / bufferLength;
      sceneIndex++;
    }

    requestAnimationFrame(scenes[sceneIndex]);
  };

  //////////////////////////////////////////////////////////// SCREEN FADES TO BLACK SCENE

  const bb = () => {

    c.fillStyle = `rgba(0, 0, 0, 0.1)`;
    c.fillRect(0, 0, canvas.width, canvas.height);

    if (c.getImageData(0, 0, 1, 1).data[0] == 4) sceneIndex++;

    requestAnimationFrame(scenes[sceneIndex]);
  };

  //////////////////////////////////////////////////////////// RICHARD FADES IN SCENE

  let richardAlpha = 0;
  const cc = () => {

    analyser.getByteFrequencyData(dataArray);

    c.globalAlpha = 1;
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    const richardScale = 0.15;
    const richardX = (canvas.width - images.richard.width * richardScale) / 2;
    const richardY = (canvas.height - images.richard.height * richardScale) / 2;
    const richardW = images.richard.width * richardScale;
    const richardH = images.richard.height * richardScale;
    if (richardAlpha < 1) richardAlpha += 0.005;
    c.globalAlpha = richardAlpha;
    c.drawImage(images.richard, richardX, richardY, richardW, richardH);

    c.fillStyle = 'white';
    for (let i = 0; i < bufferLength; i++) {
      const x = barWidth / 2 * i;
      const barHeight = dataArray[i] / 4;
      c.fillRect(x, canvas.height - barHeight, barWidth / 2, barHeight);
      c.fillRect(canvas.width - (x + 1), canvas.height - barHeight, barWidth / 2, barHeight);
    }

    if (audio.currentTime > 13.09) sceneIndex++;

    requestAnimationFrame(scenes[sceneIndex]);
  };

  //////////////////////////////////////////////////////////// BEAT DROPPED SCENE

  let chainOffset = -500;
  let paOffset = 500;
  let bluntOffset = -2000;
  const dd = () => {

    analyser.getByteFrequencyData(dataArray);

    c.globalAlpha = 1;
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    const shaking = dataArray[5] > 250;
    const shakeX = shaking ? (Math.random() - 0.5) * 25 : (Math.random() - 0.5) * 2;
    const shakeY = shaking ? (Math.random() - 0.5) * 25 : (Math.random() - 0.5) * 2;

    const richardScale = 0.15;
    const richardX = (canvas.width - images.richard.width * richardScale) / 2;
    const richardY = (canvas.height - images.richard.height * richardScale) / 2;
    const richardW = images.richard.width * richardScale;
    const richardH = images.richard.height * richardScale;
    c.drawImage(images.richard, richardX + shakeX, richardY + shakeY, richardW, richardH);

    const laserScale = 0.4;
    c.drawImage(
      images.laser,
      richardX - 444 * laserScale + 3867 * richardScale + shakeX,
      richardY - 224 * laserScale + 519 * richardScale + shakeY,
      images.laser.width * laserScale,
      images.laser.height * laserScale
    );
    c.drawImage(
      images.laser,
      richardX - 444 * laserScale + 4078 * richardScale + shakeX,
      richardY - 224 * laserScale + 508 * richardScale + shakeY,
      images.laser.width * laserScale,
      images.laser.height * laserScale
    );

    if (chainOffset < 0) chainOffset += 5;
    const chainScale = 0.5;
    c.drawImage(
      images.chain,
      richardX - 105 * chainScale + 3808 * richardScale + shakeX,
      richardY - 23 * chainScale + 927 * richardScale + chainOffset + shakeY,
      images.chain.width * chainScale,
      images.chain.height * chainScale
    );

    if (bluntOffset < 0 && paOffset < 5) bluntOffset += 10;
    const bluntScale = 0.5;
    c.drawImage(
      images.blunt,
      richardX - 190 * bluntScale + 3628 * richardScale + bluntOffset + shakeX,
      richardY - 236 * bluntScale + 1961 * richardScale + shakeY,
      images.blunt.width * bluntScale,
      images.blunt.height * bluntScale
    );

    if (paOffset > 0 && chainOffset > -1) paOffset -= 5;
    const paScale = 0.25;
    c.drawImage(
      images.pa,
      canvas.width - images.pa.width * paScale - 25 + paOffset + shakeX,
      canvas.height - images.pa.height * paScale - 25 + shakeY,
      images.pa.width * paScale,
      images.pa.height * paScale
    );

    c.fillStyle = 'white';
    for (let i = 0; i < bufferLength; i++) {
      const x = barWidth / 2 * i;
      const barHeight = dataArray[i] / 4;
      c.fillRect(x, canvas.height - barHeight, barWidth / 2, barHeight);
      c.fillRect(canvas.width - (x + 1), canvas.height - barHeight, barWidth / 2, barHeight);
    }

    if (parts.length < 25) {
      parts.push({
        x: Math.random() * canvas.width,
        y: -Math.random() * canvas.height,
        r: Math.random() * Math.PI,
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 10 + 5,
        vr: (Math.random() - 0.5) * 0.1,
        i: Math.floor(Math.random() * fallingImages.length)
      });
    }
    for (let i = parts.length - 1; i >= 0; --i) {
      const p = parts[i];
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.r);
      c.drawImage(
        fallingImages[p.i],
        -fallingImages[p.i].width * fallingImageScales[p.i] / 2,
        -fallingImages[p.i].height * fallingImageScales[p.i] / 2,
        fallingImages[p.i].width * fallingImageScales[p.i],
        fallingImages[p.i].height * fallingImageScales[p.i]
      );
      c.restore();
      if (p.y > canvas.height + 100) parts.splice(i, 1);
    }

    requestAnimationFrame(scenes[sceneIndex]);
  };

  const scenes = [aa, bb, cc, dd];
  let sceneIndex = 0;

  //////////////////////////////////////////////////////////// events

  addEventListener('load', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    requestAnimationFrame(scenes[sceneIndex]);
  });

  addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  });

  //////////////////////////////////////////////////////////// mouse

  addEventListener('mousedown', () => mouseDown = true);

  addEventListener('mouseup', () => mouseDown = false);

})();