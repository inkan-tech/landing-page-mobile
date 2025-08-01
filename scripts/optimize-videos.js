#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const VIDEO_DIRS = [
  'src/assets/img',
  'docs/assets/img'
];

const OPTIMIZATION_SETTINGS = {
  webm: {
    // High quality, smaller file size
    params: '-c:v libvpx-vp9 -crf 32 -b:v 0 -b:a 128k -c:a libopus -cpu-used 2 -pass 1 -an -f null'
  },
  mp4: {
    // H.264 with good compression
    params: '-c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k'
  }
};

async function checkFFmpeg() {
  try {
    await execAsync('ffmpeg -version');
    return true;
  } catch (error) {
    console.log('❌ FFmpeg not found. Install with: brew install ffmpeg');
    return false;
  }
}

async function getVideoInfo(filePath) {
  try {
    const { stdout } = await execAsync(`ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`);
    const info = JSON.parse(stdout);
    const videoStream = info.streams.find(s => s.codec_type === 'video');
    
    return {
      duration: parseFloat(info.format.duration),
      size: parseInt(info.format.size),
      width: videoStream?.width,
      height: videoStream?.height,
      bitrate: parseInt(info.format.bit_rate)
    };
  } catch (error) {
    console.error(`Error getting info for ${filePath}:`, error.message);
    return null;
  }
}

async function optimizeVideo(inputPath, outputPath, format) {
  const settings = OPTIMIZATION_SETTINGS[format];
  if (!settings) {
    console.log(`⚠️  No optimization settings for ${format}`);
    return false;
  }

  const tempPath = outputPath + '.tmp.' + format;
  
  try {
    console.log(`🎬 Optimizing ${path.basename(inputPath)}...`);
    
    // Get original info
    const originalInfo = await getVideoInfo(inputPath);
    if (!originalInfo) return false;
    
    // Optimize video
    const cmd = `ffmpeg -i "${inputPath}" ${settings.params} "${tempPath}" -y`;
    await execAsync(cmd);
    
    // Get optimized info
    const optimizedInfo = await getVideoInfo(tempPath);
    if (!optimizedInfo) {
      fs.unlinkSync(tempPath);
      return false;
    }
    
    // Calculate savings
    const sizeSaving = ((originalInfo.size - optimizedInfo.size) / originalInfo.size * 100);
    const originalMB = (originalInfo.size / 1024 / 1024).toFixed(1);
    const optimizedMB = (optimizedInfo.size / 1024 / 1024).toFixed(1);
    
    if (sizeSaving > 10) { // Only replace if >10% savings
      fs.renameSync(tempPath, outputPath);
      console.log(`✅ ${path.basename(inputPath)}: ${originalMB}MB → ${optimizedMB}MB (${sizeSaving.toFixed(1)}% smaller)`);
      return true;
    } else {
      fs.unlinkSync(tempPath);
      console.log(`⚪ ${path.basename(inputPath)}: Already optimized (${originalMB}MB)`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    return false;
  }
}

async function findVideos() {
  const videos = [];
  
  for (const dir of VIDEO_DIRS) {
    if (!fs.existsSync(dir)) continue;
    
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const ext = path.extname(file).toLowerCase();
      
      if (['.webm', '.mp4'].includes(ext) && fs.statSync(filePath).isFile()) {
        videos.push({
          path: filePath,
          name: file,
          format: ext.substring(1)
        });
      }
    }
  }
  
  return videos;
}

async function main() {
  console.log('🎥 Video Optimization Tool\n');
  
  // Check FFmpeg
  if (!(await checkFFmpeg())) {
    process.exit(1);
  }
  
  // Find videos
  const videos = await findVideos();
  if (videos.length === 0) {
    console.log('📁 No videos found in source directories');
    return;
  }
  
  console.log(`📋 Found ${videos.length} videos to check:\n`);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let optimizedCount = 0;
  
  // Process each video
  for (const video of videos) {
    const originalInfo = await getVideoInfo(video.path);
    if (!originalInfo) continue;
    
    totalOriginalSize += originalInfo.size;
    
    const backupPath = video.path + '.original';
    const optimizedPath = video.path;
    
    // Create backup if it doesn't exist
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(video.path, backupPath);
    }
    
    // Optimize
    const success = await optimizeVideo(backupPath, optimizedPath, video.format);
    
    if (success) {
      optimizedCount++;
      const newInfo = await getVideoInfo(optimizedPath);
      if (newInfo) totalOptimizedSize += newInfo.size;
    } else {
      totalOptimizedSize += originalInfo.size;
    }
  }
  
  // Summary
  const totalSavingsMB = (totalOriginalSize - totalOptimizedSize) / 1024 / 1024;
  const totalSavingsPercent = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100);
  
  console.log(`\n📊 Optimization Summary:`);
  console.log(`   Videos processed: ${videos.length}`);
  console.log(`   Videos optimized: ${optimizedCount}`);
  console.log(`   Total savings: ${totalSavingsMB.toFixed(1)}MB (${totalSavingsPercent.toFixed(1)}%)`);
  console.log(`\n💡 Original files backed up as *.original`);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeVideo, getVideoInfo };