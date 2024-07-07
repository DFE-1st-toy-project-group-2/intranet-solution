import LeaveApplicationItem from './LeaveApplicationItem';
import LeaveApplicationForm from './LeaveApplicationForm';
import './LeaveApplicationForm.css';
import './LeaveApplicationList.css';

const currentUser = {
  id: 'H2419001',
  name: '신혜진',
};

const applications = [
  {
    id: '1',
    userId: 'H2419001',
    username: '신혜진',
    typeForLeave: '연차',
    applicationTitle: '11',
    applicationDesc: '가족 여행',
  },
  {
    id: '2',
    userId: 'H2419002',
    username: '고낙연',
    typeForLeave: '반차',
    applicationTitle: '22',
    applicationDesc: '병원 방문',
  },
  {
    id: '3',
    userId: 'H2419001',
    username: '신혜진',
    typeForLeave: '반차',
    applicationTitle: '33',
    applicationDesc: '가족 여행',
  },
  {
    id: '4',
    userId: 'H2419004',
    username: '최미랑',
    typeForLeave: '반차',
    applicationTitle: '44',
    applicationDesc: '병원 방문',
  },
  {
    id: '5',
    userId: 'H2419001',
    username: '신혜진',
    typeForLeave: '조퇴',
    applicationTitle: '55',
    applicationDesc: '병원진료',
  },
  {
    id: '6',
    userId: 'H2419009',
    username: '이동혁',
    typeForLeave: '반차',
    applicationTitle: '66',
    applicationDesc: '병원 방문',
  },
  {
    id: '7',
    userId: 'H2419011',
    username: '송병훈',
    typeForLeave: '조퇴',
    applicationTitle: '77',
    applicationDesc: '가족모임',
  },
];

export default class LeaveApplicationList {
  constructor(container, props) {
    this.container = container;
    this.props = props;
    this.items = [];
    this.initialData = applications;
    this.currentUser = currentUser; // 현재 사용자 정보를 클래스 변수에 저장
    this.initialData.forEach((data) => {
      // 현재 사용자 정보를 각 LeaveApplicationItem에 전달
      this.items.push(new LeaveApplicationItem(data, this.currentUser));
    });
  }

  setAddEventListener() {
    const modalBackground = document.querySelector('.modal-background');
    const modal = document.querySelector('.modal');
    const btnApply = document.querySelector('.btn-apply');

    const leaveApplicationForm = new LeaveApplicationForm();

    // 모달 기본 초기화: 안보이게
    modalBackground.style.display = 'none';

    // 휴가신청하기 버튼 클릭하면,
    btnApply.addEventListener('click', () => {
      modal.innerHTML = leaveApplicationForm.render();
      modalBackground.style.display = 'block';

      // leaveApplicationForm(자식)의 setAddEventListener 실행시,
      // LeaveApplicationList(부모)로부터 내려보낼 콜백함수2개(onSubmit, onClose)를 작성
      // onSubmit에 필요한 파라미터(formData) 같이 내려보냄
      leaveApplicationForm.setAddEventListener(
        (formData) => {
          this.handleFormSubmit(formData);
          modalBackground.style.display = 'none';
        },
        () => {
          modalBackground.style.display = 'none';
        },
      );
      console.log('모달창으로 입력폼이 팝업된다');
    });

    // 내 신청서만 보기 버튼 클릭하면
    const btnShowOnlyMe = document.querySelector('.btn-show-onlyMe');
    btnShowOnlyMe.addEventListener('click', () => {
      this.filterMyApplications();
    });

    // 모달 컴포넌트의 닫기버튼(X) 클릭하면
    const btnClose = document.querySelector('.btn-close');
    btnClose.addEventListener('click', () => {
      console.log('뒤로가기 버튼 클릭됨');
      // 각 input 비워진 후

      // 모달 닫힌다
      modalBackground.style.display = 'none';
    });

    // 새로 생성된 leaveApplicationItem이 어떻게 그려질까
    const leaveApplicationItems = document.querySelector('.leave-application-items');
    leaveApplicationItems.addEventListener('click', (event) => {
      if (event.target.classList.contains('btn-edit')) {
        const itemId = event.target.dataset.id;
        console.log(itemId);
        this.editApplication(itemId);
      } else if (event.target.classList.contains('btn-delete')) {
        const itemId = event.target.dataset.id;
        this.deleteApplication(itemId);
      }
    });
  }
  // 내가 쓴 신청서에 보이는 수정버튼을 클릭하면,
  // 모달창이 열리며 수정할 수 있음
  editApplication(itemId) {
    // 여기서 itemId를 정수로 변환해주어야 합니다.
    itemId = parseInt(itemId, 10);

    // item.props.id와 동일한 타입으로 비교하기 위해 각 item.props.id도 정수로 변환하여 비교합니다.
    const application = this.items.find((item) => parseInt(item.props.id, 10) === itemId);
    if (!application) {
      console.error('No application found with id:', itemId);
      return;
    }

    // LeaveApplicationForm에서 formData를 생성하여 부모 클래스인 LeaveApplicationList로 전송할 때,
    // userId가 null로 설정되는 문제를 해결하기 위해, formData 생성 시점에 this.currentUser.id를 명확하게 포함
    // LeaveApplicationForm의 인스턴스를 생성할 때 currentUser를 props로 전달
    const leaveApplicationForm = new LeaveApplicationForm(this.container, {
      currentUser: this.currentUser,
    });
    const modalBackground = document.querySelector('.modal-background');
    const modal = document.querySelector('.modal');

    // application의 데이터를 로딩
    modal.innerHTML = leaveApplicationForm.render();
    leaveApplicationForm.loadFormData(application.props);
    modalBackground.style.display = 'block';

    leaveApplicationForm.setAddEventListener(
      (formData) => {
        this.handleFormSubmit(formData, itemId);
        modalBackground.style.display = 'none';
      },
      () => {
        modalBackground.style.display = 'none';
      },
    );
  }

  // 내 신청서만 보기 버튼 클릭하면,
  // 현재 사용자의 아이디 값 있으면 그걸로 비교해서 글 필터링
  filterMyApplications() {
    const userId = this.currentUser.id;
    const myItems = this.items.filter((item) => item.props.userId === userId);
    this.renderItems(myItems);
  }
  // 내 신청서만 보기 버튼 클릭하면,
  // 글 필터링 된 것 렌더링
  renderItems(items) {
    const leaveApplicationItems = document.querySelector('.leave-application-items');
    leaveApplicationItems.innerHTML = items.map((item) => item.render()).join('');
  }

  // leaveApplicationForm으로 부터 받아온 formData를 처리(렌더)하는 로직
  handleFormSubmit(formData, itemId = null) {
    console.log('Form submitted:', formData);
    // 여기에 formData를 처리하는 로직 추가

    if (itemId) {
      // 여기서 itemId를 숫자로 변환합니다.
      itemId = parseInt(itemId, 10);

      const itemIndex = this.items.findIndex((item) => parseInt(item.props.id, 10) === itemId);
      if (itemIndex !== -1) {
        // 기존 항목의 속성을 새 formData로 업데이트
        this.items[itemIndex].props = { ...this.items[itemIndex].props, ...formData };
        // 변경된 아이템을 다시 렌더링하여 DOM에 업데이트
        this.updateItemRender(this.items[itemIndex]);
      } else {
        console.error('Item not found: ', itemId);
        // 추가적인 디버그 정보
        console.log(
          'Available items IDs:',
          this.items.map((item) => item.props.id),
        );
      }
    } else {
      // 새 항목을 리스트에 추가하는 경우 (이 예제에서는 처리하지 않음)
      const newItem = new LeaveApplicationItem(formData, this.currentUser);
      this.items.push(newItem);
      this.addItem(newItem);
    }

    // 전체 목록을 다시 렌더링하지 않고, 변경된 부분만 처리합니다.
    // 이 방식은 불필요한 렌더링을 줄여 성능을 개선할 수 있습니다.

    // 모달 닫기
    document.querySelector('.modal-background').style.display = 'none';
  }
  addItem(item) {
    const listElement = document.querySelector('.leave-application-items');
    if (listElement) {
      const itemHTML = item.render();
      listElement.insertAdjacentHTML('beforeend', itemHTML); // 새 아이템을 리스트에 추가
    }
  }
  // 특정 아이템만 다시 렌더링하는 메서드
  updateItemRender(item) {
    const element = document.querySelector(`.leave-application-item[data-id="${item.props.id}"]`);
    if (element) {
      // item.render()를 호출하여 최신 HTML 마크업을 가져옵니다.
      element.outerHTML = item.render(); // 기존 요소를 새로운 마크업으로 교체
    }
  }
  // 내가 쓴 신청서의 삭제버튼 클릭하면,
  // 작성자 아이디와 글 아이디 비교 후 필터링,
  // 동일하지 않은 글(필터링한 결과값)만 다시 렌더링
  deleteApplication(itemId) {
    // itemId를 정수로 변환하고 올바른 아이템을 찾아서 삭제
    itemId = parseInt(itemId, 10);
    this.items = this.items.filter((item) => parseInt(item.props.id, 10) !== itemId);
    this.renderItems(this.items); // 변경된 아이템 목록을 다시 렌더링
  }
  render() {
    this.container.innerHTML = /* HTML */ `
      <section class="leave-application-wrap">
        <header class="leave-application">
          <h1 class="leave-application__heading">근태신청</h1>
        </header>
        <div class="heading-events">
          <div>
            <button class="btn-apply">휴가 신청하기</button>
            <button class="btn-show-onlyMe">내 신청서만 보기</button>
          </div>
          <div class="leave-type">
            <select>
              <option value="" selected disabled hidden>휴가 신청타입</option>
              <option value="annual-leave">연차</option>
              <option value="half-dayoff">반차</option>
              <option value="sick-leave">조퇴</option>
              <option value="others">기타</option>
            </select>
          </div>
        </div>
        <div class="leave-application-list"><ul class="leave-application-items"></ul></div>
      </section>
      <div class="modal-background">
        <button class="btn-close"></button>
        <div class="modal"></div>
      </div>
    `;
    this.setAddEventListener();
  }
}