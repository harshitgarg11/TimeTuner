document.addEventListener('DOMContentLoaded', () => {
    // Digital Clock Elements
    const digitalClockSection = document.getElementById('digitalClockSection');
    const digitalClockDisplay = document.getElementById('digitalClockDisplay');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');
    const ampmSpan = document.getElementById('ampm');
    const dateDisplay = document.getElementById('dateDisplay');
    const selectedDigitalDateInput = document.getElementById('selectedDigitalDate');

    // Analog Clock Elements
    const analogClockSection = document.getElementById('analogClockSection');
    const analogHourHand = document.getElementById('analog-hour');
    const analogMinuteHand = document.getElementById('analog-minute');
    const analogSecondHand = document.getElementById('analog-second');
    const analogDateDisplay = document.getElementById('analogDateDisplay');
    const selectedAnalogDateInput = document.getElementById('selectedAnalogDate');
    const analogFaceColorInput = document.getElementById('analogFaceColor');
    const analogHandColorInput = document.getElementById('analogHandColor');
    const analogClockFace = document.querySelector('.analog-clock');
    const analogClockCenter = document.querySelector('.analog-clock .center');

    // General Controls
    const timeZoneSelect = document.getElementById('timeZone');
    const dateFormatSelect = document.getElementById('dateFormat');
    const textColorInput = document.getElementById('textColor');
    const bgColorInput = document.getElementById('bgColor');
    const fontFamilySelect = document.getElementById('fontFamily');
    const hour12Checkbox = document.getElementById('hour12');
    const fontSizeInput = document.getElementById('fontSize');
    const fontSizeValueSpan = document.getElementById('fontSizeValue');
    const themeToggler = document.getElementById('themeToggler');
    const showDigitalBtn = document.getElementById('showDigital');
    const showAnalogBtn = document.getElementById('showAnalog');
    const themeSelect = document.getElementById('themeSelect'); 

    // Analog Clock Specific Controls (mirroring digital for now)
    const analogTimeZoneSelect = document.getElementById('analogTimeZone');
    const analogDateFormatSelect = document.getElementById('analogDateFormat');

    // Populate time zone options for analog clock (mirroring digital's options)
    const digitalTimeZoneOptions = timeZoneSelect.innerHTML;
    analogTimeZoneSelect.innerHTML = digitalTimeZoneOptions;

    // Populate date format options for analog clock (mirroring digital's options)
    const digitalDateFormatOptions = dateFormatSelect.innerHTML;
    analogDateFormatSelect.innerHTML = digitalDateFormatOptions;

    // Load saved preferences or set defaults
    const savedTimeZone = localStorage.getItem('timeZone') || '';
    const savedDateFormat = localStorage.getItem('dateFormat') || 'long';
    const savedTextColor = localStorage.getItem('textColor') || '#FFFFFF'; 
    const savedBgColor = localStorage.getItem('bgColor') || '#333333';   
    const savedFontFamily = localStorage.getItem('fontFamily') || "'Courier New', monospace";
    const savedHour12 = localStorage.getItem('hour12') === 'false' ? false : true; 
    const savedFontSize = localStorage.getItem('fontSize') || '60';
    const savedTheme = localStorage.getItem('theme') || 'auto'; 
    const savedClockView = localStorage.getItem('clockView') || 'digital';
    const savedAnalogFaceColor = localStorage.getItem('analogFaceColor') || '#EEEEEE';
    const savedAnalogHandColor = localStorage.getItem('analogHandColor') || '#333333';
    const savedDigitalDate = localStorage.getItem('selectedDigitalDate') || '';
    const savedAnalogDate = localStorage.getItem('selectedAnalogDate') || '';
    const savedClockThemeName = localStorage.getItem('clockThemeName') || 'custom'; 

    // Apply saved preferences to controls
    timeZoneSelect.value = savedTimeZone;
    dateFormatSelect.value = savedDateFormat;
    textColorInput.value = savedTextColor;
    bgColorInput.value = savedBgColor;
    fontFamilySelect.value = savedFontFamily;
    hour12Checkbox.checked = savedHour12;
    fontSizeInput.value = savedFontSize;
    fontSizeValueSpan.textContent = `${savedFontSize}px`;

    analogTimeZoneSelect.value = savedTimeZone;
    analogDateFormatSelect.value = savedDateFormat;
    analogFaceColorInput.value = savedAnalogFaceColor;
    analogHandColorInput.value = savedAnalogHandColor;
    selectedDigitalDateInput.value = savedDigitalDate;
    selectedAnalogDateInput.value = savedAnalogDate;
    themeSelect.value = savedClockThemeName; 

    // Apply saved global theme (light/dark mode) or auto-detect
    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', theme);
    }

    function autoDetectTheme() {
        const hour = new Date().getHours();
        if (hour >= 19 || hour < 6) { // Between 7 PM and 6 AM
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }

    if (savedTheme === 'auto') {
        autoDetectTheme();
    } else {
        setTheme(savedTheme);
    }

    function getTargetDate(dateInput) {
        const selectedDate = dateInput.value;
        const now = new Date();
        let targetDate = now; 

        if (selectedDate) {
            const [year, month, day] = selectedDate.split('-').map(Number);
            targetDate = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        }
        return targetDate;
    }

    function updateDigitalClock() {
        const selectedTimeZone = timeZoneSelect.value || undefined;
        const is12HourFormat = hour12Checkbox.checked;
        const selectedDateFormat = dateFormatSelect.value;
        const targetDate = getTargetDate(selectedDigitalDateInput);

        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: is12HourFormat,
            timeZone: selectedTimeZone
        };

        let dateOptions = {};
        switch(selectedDateFormat) {
            case 'long':
                dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: selectedTimeZone };
                break;
            case 'short':
                dateOptions = { month: 'numeric', day: 'numeric', year: 'numeric', timeZone: selectedTimeZone };
                break;
            case 'iso':
                dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: selectedTimeZone };
                break;
        }

        const timeFormatter = new Intl.DateTimeFormat('en-US', timeOptions);
        const timeParts = timeFormatter.formatToParts(targetDate);

        let hours = '';
        let minutes = '';
        let seconds = '';
        let ampm = '';

        timeParts.forEach(part => {
            if (part.type === 'hour') hours = part.value;
            if (part.type === 'minute') minutes = part.value;
            if (part.type === 'second') seconds = part.value;
            if (part.type === 'dayPeriod') ampm = part.value;
        });

        hoursSpan.textContent = hours;
        minutesSpan.textContent = minutes;
        secondsSpan.textContent = seconds;
        ampmSpan.textContent = ampm;

        const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
        dateDisplay.textContent = dateFormatter.format(targetDate);
    }

    function updateAnalogClock() {
        const selectedTimeZone = analogTimeZoneSelect.value || undefined;
        const selectedDateFormat = analogDateFormatSelect.value;
        const targetDate = getTargetDate(selectedAnalogDateInput);

        const nowInTimeZone = new Date(targetDate.toLocaleString('en-US', { timeZone: selectedTimeZone }));
        
        const currentHour = nowInTimeZone.getHours(); 
        const currentMinute = nowInTimeZone.getMinutes();
        const currentSecond = nowInTimeZone.getSeconds();

        const secondDegrees = currentSecond * 6; 
        const minuteDegrees = (currentMinute * 6) + (currentSecond * 0.1); 
        const hourDegrees = ((currentHour % 12) * 30) + (currentMinute * 0.5) + (currentSecond * (0.5/60)); 

        analogSecondHand.style.transform = `rotate(${secondDegrees}deg)`;
        analogMinuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        analogHourHand.style.transform = `rotate(${hourDegrees}deg)`;

        let dateOptions = {};
        switch(selectedDateFormat) {
            case 'long':
                dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: selectedTimeZone };
                break;
            case 'short':
                dateOptions = { month: 'numeric', day: 'numeric', year: 'numeric', timeZone: selectedTimeZone };
                break;
            case 'iso':
                dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: selectedTimeZone };
                break;
        }
        const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);
        analogDateDisplay.textContent = dateFormatter.format(targetDate);
    }

    function applyStyles() {
        // Apply digital clock's font family and size regardless of theme
        digitalClockDisplay.style.fontFamily = fontFamilySelect.value;
        digitalClockDisplay.style.fontSize = `${fontSizeInput.value}px`; 
        fontSizeValueSpan.textContent = `${fontSizeInput.value}px`;

        const selectedClockThemeName = themeSelect.value; 
        
        // Define all possible theme classes for cleanup
        const allClockThemes = ['classic', 'sunset', 'space', 'aqua', 'forest', 'minimal', 'neon', 'midnight', 'vintage', 'gradientBlue'];

        // Remove all theme classes from digital clock, analog clock face, and body
        allClockThemes.forEach(theme => {
            digitalClockDisplay.classList.remove(`theme-${theme}`);
            analogClockFace.classList.remove(`theme-${theme}`);
            document.body.classList.remove(`body-theme-${theme}`);
            document.body.classList.remove(`body-theme-live-gradient`); // Also remove the live gradient class specifically
        });
        
        if (selectedClockThemeName === 'custom') {
            // Apply custom colors/backgrounds to digital clock and analog face via inline styles
            digitalClockDisplay.style.backgroundColor = bgColorInput.value;
            digitalClockDisplay.style.color = textColorInput.value;
            analogClockFace.style.backgroundColor = analogFaceColorInput.value;
            analogClockFace.style.borderColor = analogHandColorInput.value; 

            // Enable color pickers
            textColorInput.disabled = false;
            bgColorInput.disabled = false;
            analogFaceColorInput.disabled = false;
            analogHandColorInput.disabled = false;

            // Ensure body background reverts to default light/dark mode gradient
            document.body.style.background = ''; 
            document.body.style.backgroundSize = '';
            document.body.style.backgroundAttachment = '';
        } else if (selectedClockThemeName === 'live-gradient') {
            // For the live gradient, apply special class to body
            document.body.classList.add('body-theme-live-gradient');

            // For the clocks themselves, revert to default colors or pick a sensible one
            digitalClockDisplay.style.backgroundColor = 'var(--clock-display-bg-default)';
            digitalClockDisplay.style.color = 'var(--clock-display-text-default)';
            analogClockFace.style.backgroundColor = 'var(--container-bg)'; // Use container bg for analog face
            analogClockFace.style.borderColor = 'var(--label-color)'; 

            // Re-enable color pickers in case user wants to customize clock foreground on live background
            textColorInput.disabled = false;
            bgColorInput.disabled = false;
            analogFaceColorInput.disabled = false;
            analogHandColorInput.disabled = false;

        } else { // All other predefined themes
            // Apply selected theme classes to digital clock, analog face, and BODY
            digitalClockDisplay.classList.add(`theme-${selectedClockThemeName}`);
            analogClockFace.classList.add(`theme-${selectedClockThemeName}`);
            document.body.classList.add(`body-theme-${selectedClockThemeName}`); // Apply theme to body
            
            // Disable color pickers as theme dictates colors
            textColorInput.disabled = true;
            bgColorInput.disabled = true;
            analogFaceColorInput.disabled = true;
            analogHandColorInput.disabled = true;

            // Clear any previous inline color styles that might override the theme classes
            digitalClockDisplay.style.backgroundColor = '';
            digitalClockDisplay.style.color = '';
            analogClockFace.style.backgroundColor = '';
            analogClockFace.style.borderColor = '';
        }

        // Analog hand and center colors always follow their respective color inputs (even if disabled visually)
        analogClockCenter.style.backgroundColor = analogHandColorInput.value; 
        analogHourHand.style.backgroundColor = analogHandColorInput.value;
        analogMinuteHand.style.backgroundColor = analogHandColorInput.value;

        // Save all current customization settings
        localStorage.setItem('textColor', textColorInput.value);
        localStorage.setItem('bgColor', bgColorInput.value);
        localStorage.setItem('fontFamily', fontFamilySelect.value);
        localStorage.setItem('fontSize', fontSizeInput.value);
        localStorage.setItem('analogFaceColor', analogFaceColorInput.value);
        localStorage.setItem('analogHandColor', analogHandColorInput.value);
        localStorage.setItem('clockThemeName', selectedClockThemeName); 
    }

    function switchClockView(view) {
        if (view === 'digital') {
            digitalClockSection.classList.remove('hidden');
            analogClockSection.classList.add('hidden');
            showDigitalBtn.classList.add('active');
            showAnalogBtn.classList.remove('active');
            selectedDigitalDateInput.value = selectedAnalogDateInput.value;
        } else {
            digitalClockSection.classList.add('hidden');
            analogClockSection.classList.remove('hidden');
            showDigitalBtn.classList.remove('active');
            showAnalogBtn.classList.add('active');
            selectedAnalogDateInput.value = selectedDigitalDateInput.value;
        }
        localStorage.setItem('clockView', view);
        updateClocks(); 
        applyStyles(); 
    }

    function updateClocks() {
        updateDigitalClock();
        updateAnalogClock();
    }

    function toggleTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        setTheme(isDarkMode ? 'light' : 'dark');
        applyStyles(); 
    }

    // Event Listeners for customization
    timeZoneSelect.addEventListener('change', () => {
        updateDigitalClock();
        localStorage.setItem('timeZone', timeZoneSelect.value);
        analogTimeZoneSelect.value = timeZoneSelect.value; 
    });
    dateFormatSelect.addEventListener('change', () => {
        updateDigitalClock();
        localStorage.setItem('dateFormat', dateFormatSelect.value);
        analogDateFormatSelect.value = dateFormatSelect.value; 
    });
    textColorInput.addEventListener('input', applyStyles);
    bgColorInput.addEventListener('input', applyStyles);
    fontFamilySelect.addEventListener('change', applyStyles);
    fontSizeInput.addEventListener('input', applyStyles);
    hour12Checkbox.addEventListener('change', () => {
        updateDigitalClock();
        localStorage.setItem('hour12', hour12Checkbox.checked);
    });
    selectedDigitalDateInput.addEventListener('change', () => {
        updateDigitalClock();
        localStorage.setItem('selectedDigitalDate', selectedDigitalDateInput.value);
        selectedAnalogDateInput.value = selectedDigitalDateInput.value; 
    });
    themeSelect.addEventListener('change', () => {
        applyStyles(); 
        localStorage.setItem('clockThemeName', themeSelect.value); 
    });

    // Analog specific control listeners
    analogTimeZoneSelect.addEventListener('change', () => {
        updateAnalogClock();
        localStorage.setItem('timeZone', analogTimeZoneSelect.value);
        timeZoneSelect.value = analogTimeZoneSelect.value; 
    });
    analogDateFormatSelect.addEventListener('change', () => {
        updateAnalogClock();
        localStorage.setItem('dateFormat', analogDateFormatSelect.value);
        dateFormatSelect.value = analogDateFormatSelect.value; 
    });
    analogFaceColorInput.addEventListener('input', applyStyles); 
    analogHandColorInput.addEventListener('input', applyStyles); 
    selectedAnalogDateInput.addEventListener('change', () => {
        updateAnalogClock();
        localStorage.setItem('selectedAnalogDate', selectedAnalogDateInput.value);
        selectedDigitalDateInput.value = selectedAnalogDateInput.value; 
    });

    // Theme and View Toggles
    themeToggler.addEventListener('click', toggleTheme);
    showDigitalBtn.addEventListener('click', () => switchClockView('digital'));
    showAnalogBtn.addEventListener('click', () => switchClockView('analog'));

    // Initial setup
    const today = new Date().toISOString().split('T')[0];
    if (!selectedDigitalDateInput.value) {
        selectedDigitalDateInput.value = today;
        localStorage.setItem('selectedDigitalDate', today);
    }
    if (!selectedAnalogDateInput.value) {
        selectedAnalogDateInput.value = today;
        localStorage.setItem('selectedAnalogDate', today);
    }

    applyStyles(); 
    switchClockView(savedClockView); 

    // Update clocks every second
    setInterval(updateClocks, 1000);
});
  window.addEventListener('load', () => {
    const credit = document.querySelector('.footer a');
    if (!credit || !credit.textContent.includes('Harshit Garg')) {
        console.warn("Footer credit missing or changed!");
        // You could trigger a warning or log
    }
});
