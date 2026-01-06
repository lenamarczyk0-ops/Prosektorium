// Memorial Image Generator
class MemorialGenerator {
    constructor() {
        this.canvas = document.getElementById('memorialCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Form elements
        this.firstNameInput = document.getElementById('firstName');
        this.lastNameInput = document.getElementById('lastName');
        this.birthDateInput = document.getElementById('birthDate');
        this.deathDateInput = document.getElementById('deathDate');
        this.photoUpload = document.getElementById('photoUpload');
        this.removePhotoBtn = document.getElementById('removePhoto');
        this.videoBtn = document.getElementById('videoBtn');
        this.fileNameSpan = document.getElementById('fileName');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        this.uploadedPhoto = null;
        this.uploadedBranch = null;
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.firstNameInput.addEventListener('input', () => this.render());
        this.lastNameInput.addEventListener('input', () => this.render());
        this.birthDateInput.addEventListener('input', () => this.render());
        this.deathDateInput.addEventListener('input', () => this.render());
        
        this.photoUpload.addEventListener('change', (e) => this.handlePhotoUpload(e));
        this.removePhotoBtn.addEventListener('click', () => this.removePhoto());
        this.videoBtn.addEventListener('click', () => this.generateVideo());
        
        // Load default branch image
        this.loadDefaultBranch();
    }
    
    loadDefaultBranch() {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Required for VideoFrame creation
        img.onload = () => {
            this.uploadedBranch = img;
            this.render();
        };
        img.src = 'galazka/galazkaa.png';
    }
    
    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.crossOrigin = 'anonymous'; // Required for VideoFrame creation
                img.onload = () => {
                    this.uploadedPhoto = img;
                    this.render();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            this.fileNameSpan.textContent = file.name;
            this.removePhotoBtn.style.display = 'block';
        }
    }
    
    removePhoto() {
        this.uploadedPhoto = null;
        this.photoUpload.value = '';
        this.fileNameSpan.textContent = 'Nie wybrano pliku';
        this.removePhotoBtn.style.display = 'none';
        this.render();
    }
    
    render() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas with black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        
        // Get form values
        const firstName = this.firstNameInput.value || '';
        const lastName = this.lastNameInput.value || '';
        const birthDate = this.birthDateInput.value || '';
        const deathDate = this.deathDateInput.value || '';
        
        // Calculate positions based on photo presence
        const hasPhoto = this.uploadedPhoto !== null;
        const textX = hasPhoto ? 120 : 200;
        
        // Draw name with small caps style
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        
        // First name - larger first letter
        if (firstName) {
            const firstLetter = firstName.charAt(0).toUpperCase();
            const restName = firstName.slice(1).toUpperCase();
            
            ctx.font = '500 72px "Cormorant Garamond", Georgia, serif';
            const firstLetterWidth = ctx.measureText(firstLetter).width;
            ctx.fillText(firstLetter, textX, 200);
            
            ctx.font = '500 56px "Cormorant Garamond", Georgia, serif';
            ctx.fillText(restName, textX + firstLetterWidth, 200);
        }
        
        // Last name - larger first letter
        if (lastName) {
            const firstLetter = lastName.charAt(0).toUpperCase();
            const restName = lastName.slice(1).toUpperCase();
            
            ctx.font = '500 72px "Cormorant Garamond", Georgia, serif';
            const firstLetterWidth = ctx.measureText(firstLetter).width;
            ctx.fillText(firstLetter, textX, 280);
            
            ctx.font = '500 56px "Cormorant Garamond", Georgia, serif';
            ctx.fillText(restName, textX + firstLetterWidth, 280);
        }
        
        // Draw small decorative branch below name (if uploaded)
        if (this.uploadedBranch) {
            this.drawSmallBranch(ctx, textX + 80, 360);
        }
        
        // Draw dates
        ctx.font = 'italic 48px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = '#ffffff';
        
        if (birthDate) {
            ctx.fillText(birthDate, textX, 500);
        }
        if (deathDate) {
            ctx.fillText(deathDate, textX, 570);
        }
        
        // Draw large decorative branch on right (if uploaded)
        if (this.uploadedBranch) {
            this.drawLargeBranch(ctx, width - 350, height / 2);
        }
        
        // Draw photo if uploaded
        if (this.uploadedPhoto) {
            this.drawPhoto(ctx, width - 450, 100, 350, 500);
        }
    }
    
    drawSmallBranch(ctx, x, y) {
        if (!this.uploadedBranch) return;
        
        const img = this.uploadedBranch;
        const maxWidth = 120;
        const maxHeight = 60;
        
        let width = img.width;
        let height = img.height;
        
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
    }
    
    drawLargeBranch(ctx, x, y) {
        if (!this.uploadedBranch) return;
        
        const img = this.uploadedBranch;
        const maxWidth = 400;
        const maxHeight = 500;
        
        let width = img.width;
        let height = img.height;
        
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
    }
    
    drawPhoto(ctx, x, y, maxWidth, maxHeight) {
        const img = this.uploadedPhoto;
        
        // Calculate dimensions to fit while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
        
        // Center the image in the available space
        const offsetX = x + (maxWidth - width) / 2;
        const offsetY = y + (maxHeight - height) / 2;
        
        // Draw subtle frame
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX - 5, offsetY - 5, width + 10, height + 10);
        
        // Draw image
        ctx.drawImage(img, offsetX, offsetY, width, height);
        
        // Add subtle vignette effect
        const gradient = ctx.createRadialGradient(
            offsetX + width / 2, offsetY + height / 2, Math.min(width, height) * 0.3,
            offsetX + width / 2, offsetY + height / 2, Math.max(width, height) * 0.7
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(offsetX, offsetY, width, height);
    }
    
    async generateVideo() {
        const firstName = this.firstNameInput.value || 'memorial';
        const lastName = this.lastNameInput.value || '';
        const filename = `${firstName}_${lastName}_pamiatka.mp4`.replace(/\s+/g, '_');
        
        // Show progress
        this.progressContainer.style.display = 'block';
        this.progressFill.style.width = '0%';
        this.progressText.textContent = 'Przygotowywanie...';
        this.videoBtn.disabled = true;
        
        try {
            // Check if VideoEncoder is supported
            if (typeof VideoEncoder === 'undefined') {
                throw new Error('Twoja przeglądarka nie obsługuje WebCodecs API. Użyj Chrome lub Edge.');
            }
            
            // Use smaller dimensions for better codec compatibility
            // Make dimensions divisible by 16 for H.264
            const width = 1280;
            const height = 720;
            const fps = 10; // Lower FPS for static content (saves processing time and file size)
            const duration = 180; // 3 minutes = 180 seconds
            const totalFrames = fps * duration;
            
            // Create offscreen canvas for rendering at target resolution
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = width;
            offscreenCanvas.height = height;
            const offscreenCtx = offscreenCanvas.getContext('2d');
            
            // Calculate bitrate to stay under 9.5MB for 3 minutes
            // 9.5 MB = 76 Mbit, 76/180 ≈ 0.42 Mbps, using 400 kbps for safety
            const bitrate = 400_000; // 400 kbps
            
            // Check codec support
            const codecConfig = {
                codec: 'avc1.42001f', // H.264 Baseline Level 3.1
                width: width,
                height: height,
                bitrate: bitrate,
                framerate: fps,
                avc: { format: 'avc' }
            };
            
            const support = await VideoEncoder.isConfigSupported(codecConfig);
            if (!support.supported) {
                throw new Error('Kodek H.264 nie jest obsługiwany przez tę przeglądarkę');
            }
            
            // Create MP4 muxer
            let muxer = new Mp4Muxer.Muxer({
                target: new Mp4Muxer.ArrayBufferTarget(),
                video: {
                    codec: 'avc',
                    width: width,
                    height: height
                },
                fastStart: 'in-memory'
            });
            
            // Create video encoder
            let encoderError = null;
            const encoder = new VideoEncoder({
                output: (chunk, meta) => {
                    muxer.addVideoChunk(chunk, meta);
                },
                error: (e) => {
                    console.error('Encoder error:', e);
                    encoderError = e;
                }
            });
            
            encoder.configure(support.config);
            
            // Generate frames
            for (let i = 0; i < totalFrames; i++) {
                if (encoderError) throw encoderError;
                
                const progress = i / totalFrames;
                
                // Update progress bar
                this.progressFill.style.width = `${progress * 90}%`;
                this.progressText.textContent = `Generowanie klatki ${i + 1}/${totalFrames}...`;
                
                // Render animated frame to main canvas
                this.renderAnimated(progress);
                
                // Copy to offscreen canvas at target resolution
                offscreenCtx.drawImage(this.canvas, 0, 0, width, height);
                
                // Create VideoFrame from offscreen canvas
                const frame = new VideoFrame(offscreenCanvas, {
                    timestamp: (i * 1000000) / fps, // microseconds
                    duration: 1000000 / fps
                });
                
                // Encode frame (keyframe every second)
                encoder.encode(frame, { keyFrame: i % fps === 0 });
                frame.close();
                
                // Yield to UI every few frames
                if (i % 10 === 0) {
                    await new Promise(r => setTimeout(r, 1));
                }
            }
            
            // Wait for encoder to finish
            await encoder.flush();
            encoder.close();
            
            // Finalize MP4
            muxer.finalize();
            
            // Render final frame to main canvas
            this.render();
            
            // Get the MP4 data
            const mp4Data = muxer.target.buffer;
            const mp4Blob = new Blob([mp4Data], { type: 'video/mp4' });
            
            // Check file size
            const maxSize = 9.5 * 1024 * 1024;
            const fileSizeMB = mp4Blob.size / (1024 * 1024);
            
            this.progressFill.style.width = '100%';
            this.progressText.textContent = `Rozmiar: ${fileSizeMB.toFixed(2)} MB`;
            
            if (mp4Blob.size > maxSize) {
                this.progressText.textContent = `Plik: ${fileSizeMB.toFixed(2)} MB (przekracza limit 9.5 MB)`;
            }
            
            // Download
            const url = URL.createObjectURL(mp4Blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            
            URL.revokeObjectURL(url);
            
            setTimeout(() => {
                this.progressContainer.style.display = 'none';
                this.videoBtn.disabled = false;
            }, 2000);
            
        } catch (error) {
            console.error('Error generating video:', error);
            this.progressText.textContent = 'Błąd: ' + (error.message || error);
            
            // Restore main canvas
            this.render();
            
            setTimeout(() => {
                this.progressContainer.style.display = 'none';
                this.videoBtn.disabled = false;
            }, 3000);
        }
    }
    
    renderAnimated(progress) {
        // Content visible from first to last frame (no black frames)
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas with black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        
        // Get form values
        const firstName = this.firstNameInput.value || '';
        const lastName = this.lastNameInput.value || '';
        const birthDate = this.birthDateInput.value || '';
        const deathDate = this.deathDateInput.value || '';
        
        // Calculate positions based on photo presence
        const hasPhoto = this.uploadedPhoto !== null;
        const textX = hasPhoto ? 120 : 200;
        
        // All elements visible at full opacity (no animation)
        const opacity = 1;
        
        // Draw name with small caps style
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.textAlign = 'left';
        
        // First name - larger first letter
        if (firstName) {
            const firstLetter = firstName.charAt(0).toUpperCase();
            const restName = firstName.slice(1).toUpperCase();
            
            ctx.font = '500 72px "Cormorant Garamond", Georgia, serif';
            const firstLetterWidth = ctx.measureText(firstLetter).width;
            ctx.fillText(firstLetter, textX, 200);
            
            ctx.font = '500 56px "Cormorant Garamond", Georgia, serif';
            ctx.fillText(restName, textX + firstLetterWidth, 200);
        }
        
        // Last name - larger first letter
        if (lastName) {
            const firstLetter = lastName.charAt(0).toUpperCase();
            const restName = lastName.slice(1).toUpperCase();
            
            ctx.font = '500 72px "Cormorant Garamond", Georgia, serif';
            const firstLetterWidth = ctx.measureText(firstLetter).width;
            ctx.fillText(firstLetter, textX, 280);
            
            ctx.font = '500 56px "Cormorant Garamond", Georgia, serif';
            ctx.fillText(restName, textX + firstLetterWidth, 280);
        }
        
        // Draw small decorative branch below name (if uploaded)
        if (this.uploadedBranch) {
            this.drawSmallBranch(ctx, textX + 80, 360);
        }
        
        // Draw dates
        ctx.font = 'italic 48px "Cormorant Garamond", Georgia, serif';
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        
        if (birthDate) {
            ctx.fillText(birthDate, textX, 500);
        }
        if (deathDate) {
            ctx.fillText(deathDate, textX, 570);
        }
        
        // Draw large decorative branch on right (if uploaded)
        if (this.uploadedBranch) {
            this.drawLargeBranch(ctx, width - 350, height / 2);
        }
        
        // Draw photo if uploaded
        if (this.uploadedPhoto) {
            this.drawPhoto(ctx, width - 450, 100, 350, 500);
        }
    }
    
    easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MemorialGenerator();
});
