import './Home.css';
import { AttendanceList } from '../attendancePreview/AttendanceList';
import { phoneIcon, jobIcon, emailIcon } from '../../utils/icons';
export class Home {
  constructor(container) {
    const {
      name = '이동혁',
      position = '신입',
      atWork = 0,
      phone = '010-2826-3158',
      email = 'asd1234',
    } = sessionStorage;

    this.userName = name;
    this.rank = position;
    this.atWork = atWork;
    this.ph = phone;
    this.email = email;

    this.container = container;

    this.timeFormatter = new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  // 이름, 사원, 현재시간, 현재상태, 근무상태
  render() {
    this.container.innerHTML = /* HTML */ `
      <section class="user-dashboard__wrap">
        <div>
          <div class="working-timer-page">
            <div class="work">
              <div class="summary">
                <img src="src/assets/images/avatar-default.jpg" alt="" />
                <div class="worker-name">${this.userName}</div>
                <div class="worker-rank">${this.rank}</div>
              </div>
              <div class="punching-displayer">
                <div class="timer">
                  <p class="current-time">현재시간</p>
                  <p class="current-displayer">8:21</p>
                </div>
                <div class="working-status">
                  <p class="current-status">현재상태</p>
                  <p class="current-displayer">${this.atWork == 1 ? '근무중' : '퇴근'}</p>
                </div>
              </div>
              <button class="puncher">근무시작</button>
            </div>
            <div class="profil-mini">
              <div class="profile-title">PROFILE</div>
              <div class="ph-section">
                <p class="ph-title">
                  ${phoneIcon()}Phone
                </p>
                <p class="ph-number">${this.ph}</p>
              </div>
              <div class="rank-section">
                <p class="rank-title">${jobIcon()}Job</p>
                <p class="rank-name">${this.rank}</p>
              </div>
              <div class="email-section">
                <p class="email-title">${emailIcon()}</span>Emaiil</p>
                <p class="email-address">${this.email}</p>
              </div>
            </div>
        </div>
        </div>
          <div class='attendanceList'>
          </div>
        
        
      </section>
    `;
    const attendenList = new AttendanceList(document.querySelector('.attendanceList'), {});
    attendenList.render();
    this.timepuchListener();
    this.startClock();
  }

  startClock() {
    this.updateCurrentTime();
    setInterval(this.updateCurrentTime, 1000);
  }

  updateCurrentTime = () => {
    const timeString = this.timeFormatter.format(new Date());
    const timeDisplay = this.container.querySelector('.timer .current-displayer');
    if (timeDisplay) {
      timeDisplay.textContent = timeString;
    }
  };

  timepuchListener() {
    const puncherButton = this.container.querySelector('.puncher');
    puncherButton.addEventListener('click', async () => {
      this.atWork = 1 - this.atWork; // 0과 1 사이를 토글

      this.updateWorkStatus();
    });
  }

  updateWorkStatus() {
    const statusDisplay = this.container.querySelector('.working-status .current-displayer');
    const puncherButton = this.container.querySelector('.puncher');

    statusDisplay.textContent = this.atWork == 1 ? '근무중' : '퇴근';
    puncherButton.textContent = this.atWork == 1 ? '근무종료' : '근무시작';
  }
}