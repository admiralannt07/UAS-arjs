document.addEventListener('DOMContentLoaded', () => {
    // Get the model entities from the scene
    const jirenModel = document.getElementById('jiren_model');
    const gokuBlackModel = document.getElementById('goku_black_model');

    // --- Jiren's Control Buttons ---
    const jirenIdleBtn = document.getElementById('jiren-idle-btn');
    const jirenAttackBtn = document.getElementById('jiren-attack-btn');
    const jirenPowerUpBtn = document.getElementById('jiren-powerup-btn');

    // --- Goku Black's Control Buttons ---
    const gokuIdleBtn = document.getElementById('goku-idle-btn');
    const gokuAttackBtn = document.getElementById('goku-attack-btn');
    const gokuTransformBtn = document.getElementById('goku-transform-btn');
    
    // --- Audio Elements ---
    const jirenPunchAudio = document.getElementById('jiren-punch');
    const jirenPowerupAudio = document.getElementById('jiren-powerup');
    const gokuPunchAudio = document.getElementById('goku-punch');
    const gokuPowerupAudio = document.getElementById('goku-powerup');
    
    // Check if models are loaded before adding listeners
    jirenModel.addEventListener('model-loaded', () => {
        console.log("Jiren model loaded!");
    });

    gokuBlackModel.addEventListener('model-loaded', () => {
        console.log("Goku Black model loaded!");
    });


    /**
     * Plays a single animation clip on a model.
     * @param {Element} model - The A-Frame entity of the model.
     * @param {string} clipName - The name of the animation clip to play.
     * @param {string} loop - How the animation should loop (e.g., 'repeat', 'once').
     */
    const playAnimation = (model, clipName, loop = 'repeat') => {
        model.setAttribute('animation-mixer', {
            clip: clipName,
            loop: loop,
            crossFadeDuration: 0.15 // Smooth transition between animations
        });
    };

    /**
     * Plays an audio element and resets it if it's already playing
     * @param {HTMLAudioElement} audio - The audio element to play
     */
    const playAudio = (audio) => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.play().catch(e => console.error("Audio play error:", e));
        }
    };

    /**
     * Chains multiple animations together in a sequence.
     * @param {Element} model - The A-Frame entity of the model.
     * @param {Array<Object>} sequence - An array of animation objects.
     * Each object should have:
     * - clip: The name of the animation clip.
     * - loop: (Optional) 'once' or 'repeat'. Defaults to 'once'.
     * - duration: (Optional) Time in ms. If provided, the next animation starts after this duration.
     * If not, the next animation starts after the current one finishes.
     * @param {string} finalClip - The animation to loop after the sequence is complete.
     */
    /**
     * Improved animation sequence player that doesn't rely on animation-finished events.
     * Uses timeouts for all animations to ensure reliable transitions.
     * @param {Element} model - The A-Frame entity of the model.
     * @param {Array<Object>} sequence - An array of animation objects.
     * @param {string} finalClip - The animation to loop after the sequence is complete.
     */
    const playAnimationSequence = (model, sequence, finalClip) => {
        // If another sequence is already running on this model, cancel it.
        if (model.cancelSequence) {
            model.cancelSequence();
        }

        let cancelled = false;
        let timeoutIds = [];

        // Cleanup function to remove timeouts
        const cleanup = () => {
            // Clear all pending timeouts
            timeoutIds.forEach(id => clearTimeout(id));
            timeoutIds = [];
            model.cancelSequence = null;
        };

        // Attach a cancellation function to the model itself.
        model.cancelSequence = () => {
            cancelled = true;
            cleanup();
        };

        // Calculate the total duration for each animation in the sequence
        // This is more reliable than waiting for animation-finished events
        const calculateAnimationDurations = () => {
            let totalDelay = 0;
            const timedSequence = [];
            
            // Process each animation and assign a start time
            sequence.forEach(anim => {
                // For animations with explicit duration, use that
                if (anim.duration) {
                    timedSequence.push({
                        ...anim,
                        startDelay: totalDelay
                    });
                    totalDelay += anim.duration;
                } else {
                    // For animations without duration, estimate based on clip name or use default
                    // You can adjust these estimates based on your specific animations
                    let estimatedDuration = 500; // Default 2 seconds
                    
                    // You can add specific duration estimates for known animations
                    if (anim.clip === 'Animation_30') estimatedDuration = 500;
                    if (anim.clip === 'Animation_18') estimatedDuration = 500;
                    
                    timedSequence.push({
                        ...anim,
                        startDelay: totalDelay,
                        estimatedDuration: estimatedDuration
                    });
                    totalDelay += estimatedDuration;
                }
            });
            
            return timedSequence;
        };
    
        // Schedule all animations with precise timings
        const timedSequence = calculateAnimationDurations();
        
        // Play each animation at its scheduled time
        timedSequence.forEach(anim => {
            const timeoutId = setTimeout(() => {
                if (cancelled) return;
                
                // Play this animation
                const loopStyle = anim.loop || 'once';
                playAnimation(model, anim.clip, loopStyle);
                
                // Log for debugging
                console.log(`Playing ${anim.clip} with loop ${loopStyle}`);
                
            }, anim.startDelay);
            
            timeoutIds.push(timeoutId);
        });
        
        // Schedule the final animation after all others complete
        const finalTimeoutId = setTimeout(() => {
            if (cancelled) return;
            
            // Play the final looping animation
            playAnimation(model, finalClip, 'repeat');
            console.log(`Playing final animation ${finalClip}`);
            
            // Clean up as we're done with the sequence
            cleanup();
        }, timedSequence.length > 0 ? 
           timedSequence[timedSequence.length - 1].startDelay + 
           (timedSequence[timedSequence.length - 1].duration || 
            timedSequence[timedSequence.length - 1].estimatedDuration) : 0);
        
        timeoutIds.push(finalTimeoutId);
    };


    // --- Jiren's Button Event Listeners ---

    // Jiren Idle
    jirenIdleBtn.addEventListener('click', () => {
        const IdleSequence = [
            { clip: 'Animation_1', loop: 'repeat', duration:1000}, // Plays once and moves to the next
            { clip: 'Animation_2', loop: 'repeat', duration:1000 } // Plays for 3s
        ];
        // After the sequence, Jiren returns to his idle stance.
        playAnimationSequence(jirenModel, IdleSequence, 'Animation_13');
    });

    // Jiren Attack Combo (Example of chaining with duration)
    // Plays Animation_30, then immediately plays Animation_29 for 3 seconds.
    jirenAttackBtn.addEventListener('click', () => {
        // Play the punch sound
        playAudio(jirenPunchAudio);
        
        const attackSequence = [
            { clip: 'Animation_30', loop: 'repeat', duration:100 }, // Plays once and moves to the next
            { clip: 'Animation_29', loop: 'repeat', duration:2300 } // Plays for 3s
        ];
        // After the sequence, Jiren returns to his idle stance.
        playAnimationSequence(jirenModel, attackSequence, 'Animation_13');
    });

    // Jiren Power Up (Example of chaining based on animation completion)
    jirenPowerUpBtn.addEventListener('click', () => {
        // Play the power up sound
        playAudio(jirenPowerupAudio);
        
        const powerUpSequence = [
            { clip: 'Animation_18', loop: 'repeat', duration:600 }, // First part of power up
            { clip: 'Animation_19', loop: 'repeat', duration:4000, crossFadeDuration:0.3},  // Second part, plays after the first finishes
        ];
        playAnimationSequence(jirenModel, powerUpSequence, 'Animation_13');
    });


    // --- Goku Black's Button Event Listeners ---

    // Goku Black Idle
    gokuIdleBtn.addEventListener('click', () => {
        const IdleSequence = [
            { clip: 'Animation_112', loop: 'repeat', duration:60}, // Plays once and moves to the next
            { clip: 'Animation_111', loop: 'repeat', duration:3000 } // Plays for 3s
        ];
        // After the sequence, Jiren returns to his idle stance.
        playAnimationSequence(gokuBlackModel, IdleSequence, 'Animation_113');
    });
    
    // Goku Black Scythe Attack
    gokuAttackBtn.addEventListener('click', () => {
        // Play the punch sound
        playAudio(gokuPunchAudio);
        
        const scytheSequence = [
            { clip: 'Animation_21', loop: 'repeat', duration: 100 },
            { clip: 'Animation_22', loop: 'repeat', duration: 200 },
            { clip: 'Animation_26', loop: 'repeat', duration: 100 },
            { clip: 'Animation_24', loop: 'repeat', duration: 300 }
        ];
        playAnimationSequence(gokuBlackModel, scytheSequence, 'Animation_113');
    });
    
    // Goku Black Transform
    gokuTransformBtn.addEventListener('click', () => {
        // Play the power up sound
        playAudio(gokuPowerupAudio);
        
        const transformSequence = [
            { clip: 'Animation_37', loop: 'repeat', duration: 500 },
            { clip: 'Animation_36', loop: 'repeat', duration: 4000 }
        ];
        playAnimationSequence(gokuBlackModel, transformSequence, 'Animation_113');
    });
});