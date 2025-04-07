const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

document.getElementById('convertBtn').onclick = async () => {
  const file = document.getElementById('uploader').files[0];
  if (!file) return alert('Select a file first!');

  document.getElementById('status').textContent = 'Loading FFmpeg...';
  if (!ffmpeg.isLoaded()) await ffmpeg.load();

  ffmpeg.FS('writeFile', 'input.avi', await fetchFile(file));

  document.getElementById('status').textContent = 'Converting...';
  await ffmpeg.run('-i', 'input.avi', 'output.mp4');

  const data = ffmpeg.FS('readFile', 'output.mp4');
  const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

  const a = document.createElement('a');
  a.href = url;
  a.download = 'converted.mp4';
  a.textContent = 'Download converted MP4';
  document.body.appendChild(a);

  document.getElementById('status').textContent = 'Done!';
};
