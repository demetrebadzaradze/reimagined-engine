const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
  mainName: 'main',
  worker: false, // ⚠️ must be false to avoid SharedArrayBuffer requirement
});

document.getElementById('convertBtn').onclick = async () => {
  const file = document.getElementById('uploader').files[0];
  if (!file) return alert('Select a file first!');

  const status = document.getElementById('status');
  status.textContent = 'Loading FFmpeg...';

  if (!ffmpeg.isLoaded()) {
    try {
      await ffmpeg.load();
    } catch (err) {
      status.textContent = 'Failed to load FFmpeg 😢';
      console.error(err);
      return;
    }
  }

  ffmpeg.FS('writeFile', 'input.avi', await fetchFile(file));

  status.textContent = 'Converting...';
  try {
    await ffmpeg.run('-i', 'input.avi', 'output.mp4');
  } catch (err) {
    status.textContent = 'Conversion failed.';
    console.error(err);
    return;
  }

  const data = ffmpeg.FS('readFile', 'output.mp4');
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

  const a = document.createElement('a');
  a.href = url;
  a.download = 'converted.mp4';
  a.textContent = 'Download converted MP4';
  document.body.appendChild(a);

  status.textContent = 'Done!';
};