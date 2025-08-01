const lengthInput = document.getElementById('length');
const includeLower = document.getElementById('includeLower');
const includeUpper = document.getElementById('includeUpper');
const includeNumbers = document.getElementById('includeNumbers');
const includeSymbols = document.getElementById('includeSymbols');
const excludeAmbiguous = document.getElementById('excludeAmbiguous');

const generateBtn = document.getElementById('generateBtn');
const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');

const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = 'O0Il1';

function generatePassword() {
  let charset = '';
  if (includeLower.checked) charset += LOWERCASE;
  if (includeUpper.checked) charset += UPPERCASE;
  if (includeNumbers.checked) charset += NUMBERS;
  if (includeSymbols.checked) charset += SYMBOLS;

  if (excludeAmbiguous.checked) {
    charset = charset
      .split('')
      .filter(char => !AMBIGUOUS.includes(char))
      .join('');
  }

  const length = Math.max(6, Math.min(64, Number(lengthInput.value)));

  if (charset.length === 0) {
    alert('Please select at least one character type!');
    return '';
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password;
}

function assessStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\|\;\:\,\.\<\>\?]/.test(pw)) score++;

  // Scale 0 to 6
  return score;
}

function updateStrengthMeter(pw) {
  const score = assessStrength(pw);
  const bar = strengthBar;
  const text = strengthText;
  const percent = (score / 6) * 100;
  bar.style.setProperty('--width', `${percent}%`);
  bar.style.setProperty('--color', score >= 4 ? '#00ff99' : '#ffaa00');

  // Update the width & color dynamically via CSS variables
  bar.querySelector('::after'); // dummy to force repaint

  bar.style.background = '#333';
  bar.style.position = 'relative';

  if (percent === 0) {
    bar.style.setProperty('--width', '0%');
    bar.querySelector('::after').style.width = '0%';
  }

  // We'll directly manipulate the ::after pseudo element by a trick:
  // But JS cannot style pseudo-elements directly, so we do this by inline style width on a child div instead:

  if (!bar.querySelector('.fill')) {
    const fill = document.createElement('div');
    fill.className = 'fill';
    fill.style.height = '100%';
    fill.style.width = `${percent}%`;
    fill.style.backgroundColor = score >= 4 ? '#00ff99' : '#ffaa00';
    fill.style.borderRadius = '12px';
    fill.style.position = 'absolute';
    fill.style.top = '0';
    fill.style.left = '0';
    bar.appendChild(fill);
  } else {
    bar.querySelector('.fill').style.width = `${percent}%`;
    bar.querySelector('.fill').style.backgroundColor = score >= 4 ? '#00ff99' : '#ffaa00';
  }

  let strength = 'Very Weak';
  if (score >= 5) strength = 'Strong';
  else if (score >= 4) strength = 'Medium';
  else if (score >= 2) strength = 'Weak';

  text.textContent = `Strength: ${strength}`;
}

generateBtn.addEventListener('click', () => {
  const pw = generatePassword();
  passwordOutput.value = pw;
  updateStrengthMeter(pw);
});

copyBtn.addEventListener('click', () => {
  if (!passwordOutput.value) return;
  navigator.clipboard.writeText(passwordOutput.value).then(() => {
    alert('Password copied to clipboard!');
  });
});
