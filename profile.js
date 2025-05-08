class ProfileFormHandler {
  constructor(formId, pictureInputId, picturePreviewId, skipButtonId) {
    this.form = document.getElementById(formId);
    this.pictureInput = document.getElementById(pictureInputId);
    this.picturePreview = document.getElementById(picturePreviewId);
    this.skipButton = document.getElementById(skipButtonId);

    this.initEvents();
  }

  initEvents() {
    this.pictureInput.addEventListener('change', () => this.previewPicture());
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.skipButton.addEventListener('click', (e) => this.handleSkip(e)); 
    this.checkProfileExists(); 
  }

  previewPicture() {
    const file = this.pictureInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.picturePreview.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const profile = {
      name: this.form.name.value,
      nickname: this.form.nickname.value,
      picture: this.picturePreview.src || null
    };

    const existingProfile = JSON.parse(localStorage.getItem('checkmateProfile'));

    if (existingProfile && existingProfile.name === profile.name && existingProfile.nickname === profile.nickname) {
      alert("This profile already exists.");
      return;
    }

    localStorage.setItem('checkmateProfile', JSON.stringify(profile));
    console.log("Profile Saved:", profile); 

    this.checkProfileExists();

    window.location.href = 'welcomepage.html';
  }

  checkProfileExists() {
    const profile = JSON.parse(localStorage.getItem('checkmateProfile'));

    if (profile && profile.name && profile.nickname) {
      console.log("Profile exists, enabling Skip button.");
      this.skipButton.disabled = false;
    } else {
      console.log("No profile, disabling Skip button.");
      this.skipButton.disabled = true;
    }
  }

  handleSkip(event) {
    console.log("Skip button clicked");

    const profile = JSON.parse(localStorage.getItem('checkmateProfile'));
    if (!profile || !profile.name || !profile.nickname) {
      alert("No profile exists, cannot skip.");
      return;
    }

    window.location.href = 'welcomepage.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProfileFormHandler('profileForm', 'picture', 'picturePreview', 'skipButton');
});