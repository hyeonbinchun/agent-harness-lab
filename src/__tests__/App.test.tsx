import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

const STORAGE_KEY = 'todos';

function renderApp() {
  return render(<App />);
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe('빈 상태', () => {
  it('TODO가 없으면 빈 상태 메시지를 표시한다', () => {
    renderApp();
    expect(screen.getByText('할 일이 없습니다.')).toBeInTheDocument();
  });
});

describe('TODO 추가', () => {
  it('Enter 키로 TODO를 추가하면 정확히 하나가 목록에 나타난다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '첫 번째 할 일{Enter}');

    expect(screen.getByText('첫 번째 할 일')).toBeInTheDocument();
    expect(screen.queryByText('할 일이 없습니다.')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem').filter(el => !el.classList.contains('empty'))).toHaveLength(1);
  });

  it('추가 버튼으로 TODO를 추가하면 정확히 하나가 목록에 나타난다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '두 번째 할 일');
    await user.click(screen.getByRole('button', { name: '추가' }));

    expect(screen.getByText('두 번째 할 일')).toBeInTheDocument();
  });

  it('TODO 추가 후 입력창이 비워진다', async () => {
    const user = userEvent.setup();
    renderApp();

    const input = screen.getByPlaceholderText('할 일을 입력하세요');
    await user.type(input, '테스트{Enter}');

    expect(input).toHaveValue('');
  });

  it('빈 문자열은 추가되지 않는다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '추가' }));

    expect(screen.getByText('할 일이 없습니다.')).toBeInTheDocument();
  });

  it('빈 문자열은 추가되지 않는다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: '추가' }));

     expect(screen.getByText('아직 할 일이 없어요 😊')).toBeInTheDocument()
  });

  it('공백만 입력하면 추가되지 않는다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '   {Enter}');

    expect(screen.getByText('할 일이 없습니다.')).toBeInTheDocument();
  });
});

describe('IME guard condition', () => {
  it('isComposing: true인 Enter keydown은 TODO를 추가하지 않는다', () => {
    renderApp();
    const input = screen.getByPlaceholderText('할 일을 입력하세요');

    fireEvent.change(input, { target: { value: '한글 입력 중' } });
    // IME 조합 중 Enter — isComposing: true
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });

    expect(screen.getByText('할 일이 없습니다.')).toBeInTheDocument();
  });

  it('isComposing: false인 Enter keydown은 TODO를 추가한다', () => {
    renderApp();
    const input = screen.getByPlaceholderText('할 일을 입력하세요');

    fireEvent.change(input, { target: { value: '한글 입력 완료' } });
    // IME 조합 완료 후 Enter — isComposing: false
    fireEvent.keyDown(input, { key: 'Enter', isComposing: false });

    expect(screen.getByText('한글 입력 완료')).toBeInTheDocument();
  });

  it('IME 조합 중 Enter 후 조합 완료 Enter — TODO가 정확히 하나만 추가된다', () => {
    renderApp();
    const input = screen.getByPlaceholderText('할 일을 입력하세요');

    fireEvent.change(input, { target: { value: '할일' } });
    // IME Enter (조합 확정)
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
    // 후속 Enter (실제 제출)
    fireEvent.keyDown(input, { key: 'Enter', isComposing: false });

    const items = screen.getAllByRole('listitem').filter(el => !el.classList.contains('empty'));
    expect(items).toHaveLength(1);
  });
});

describe('TODO 완료/미완료 토글', () => {
  it('TODO 텍스트를 클릭하면 completed 상태로 바뀐다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '토글 테스트{Enter}');
    const item = screen.getByText('토글 테스트');
    await user.click(item);

    expect(item.closest('li')).toHaveClass('completed');
  });

  it('completed 상태의 TODO를 다시 클릭하면 미완료로 돌아온다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '토글 테스트{Enter}');
    const item = screen.getByText('토글 테스트');
    await user.click(item);
    await user.click(item);

    expect(item.closest('li')).not.toHaveClass('completed');
  });
});

describe('TODO 수정', () => {
  it('수정 버튼을 누르면 edit input이 나타난다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '수정 전{Enter}');
    await user.click(screen.getByRole('button', { name: '수정' }));

    expect(screen.getByDisplayValue('수정 전')).toBeInTheDocument();
  });

  it('텍스트를 변경하고 Enter를 누르면 TODO가 업데이트된다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '원래 텍스트{Enter}');
    await user.click(screen.getByRole('button', { name: '수정' }));

    const editInput = screen.getByDisplayValue('원래 텍스트');
    await user.clear(editInput);
    await user.type(editInput, '변경된 텍스트{Enter}');

    expect(screen.getByText('변경된 텍스트')).toBeInTheDocument();
    expect(screen.queryByText('원래 텍스트')).not.toBeInTheDocument();
  });

  it('Escape를 누르면 원래 텍스트가 유지된다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '원래 텍스트{Enter}');
    await user.click(screen.getByRole('button', { name: '수정' }));

    const editInput = screen.getByDisplayValue('원래 텍스트');
    await user.clear(editInput);
    await user.type(editInput, '임시 텍스트');
    await user.keyboard('{Escape}');

    expect(screen.getByText('원래 텍스트')).toBeInTheDocument();
    expect(screen.queryByText('임시 텍스트')).not.toBeInTheDocument();
  });

  it('취소 버튼을 누르면 원래 텍스트가 유지된다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '원래 텍스트{Enter}');
    await user.click(screen.getByRole('button', { name: '수정' }));
    // user.click은 pointer 시퀀스(blur→click)에서 React 19 + jsdom 타이밍 문제가 있음.
    // 취소 버튼의 click handler가 cancelEdit을 호출한다는 behavior 자체를 검증한다.
    fireEvent.click(screen.getByRole('button', { name: '취소' }));

    expect(screen.getByText('원래 텍스트')).toBeInTheDocument();
  });

  it('빈 텍스트로 확정하면 원래 텍스트가 유지된다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '원래 텍스트{Enter}');
    await user.click(screen.getByRole('button', { name: '수정' }));

    const editInput = screen.getByDisplayValue('원래 텍스트');
    await user.clear(editInput);
    await user.keyboard('{Enter}');

    expect(screen.getByText('원래 텍스트')).toBeInTheDocument();
  });

  it('수정된 텍스트가 localStorage에 저장된다', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '원래 텍스트{Enter}');
    await user.click(screen.getByRole('button', { name: '수정' }));

    const editInput = screen.getByDisplayValue('원래 텍스트');
    await user.clear(editInput);
    await user.type(editInput, '변경된 텍스트{Enter}');
    unmount();

    renderApp();
    expect(screen.getByText('변경된 텍스트')).toBeInTheDocument();
  });
});

describe('TODO 삭제', () => {
  it('삭제 버튼을 누르면 해당 TODO가 목록에서 제거된다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '삭제할 항목{Enter}');
    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(screen.queryByText('삭제할 항목')).not.toBeInTheDocument();
    expect(screen.getByText('할 일이 없습니다.')).toBeInTheDocument();
  });
});

describe('우선순위', () => {
  it('기본 우선순위는 보통이다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '기본 우선순위{Enter}');

    const item = screen.getByText('기본 우선순위').closest('li') as HTMLElement;
    expect(within(item).getByRole('combobox')).toHaveValue('medium');
  });

  it('추가 시 선택한 우선순위로 TODO가 생성된다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.selectOptions(screen.getByLabelText('우선순위'), '높음');
    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '긴급 작업{Enter}');

    const item = screen.getByText('긴급 작업').closest('li') as HTMLElement;
    expect(within(item).getByRole('combobox')).toHaveValue('high');
  });

  it('항목별 우선순위 선택으로 우선순위를 변경할 수 있다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '변경 대상{Enter}');

    const item = screen.getByText('변경 대상').closest('li') as HTMLElement;
    await user.selectOptions(screen.getByLabelText('변경 대상 우선순위'), '낮음');

    expect(within(item).getByRole('combobox')).toHaveValue('low');
  });

  it('우선순위가 높은 순으로 정렬되어 표시된다', async () => {
    const user = userEvent.setup();
    renderApp();

    const input = screen.getByPlaceholderText('할 일을 입력하세요');

    await user.type(input, '보통 작업{Enter}');
    await user.selectOptions(screen.getByLabelText('우선순위'), '낮음');
    await user.type(input, '낮은 작업{Enter}');
    await user.selectOptions(screen.getByLabelText('우선순위'), '높음');
    await user.type(input, '높은 작업{Enter}');

    const items = screen.getAllByRole('listitem').filter(el => !el.classList.contains('empty'));
    expect(items.map(el => el.textContent)).toEqual([
      expect.stringContaining('높은 작업'),
      expect.stringContaining('보통 작업'),
      expect.stringContaining('낮은 작업'),
    ]);
  });

  it('우선순위가 localStorage에 저장되고 재마운트 시 복원된다', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp();

    await user.selectOptions(screen.getByLabelText('우선순위'), '높음');
    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '유지될 우선순위{Enter}');
    unmount();

    renderApp();

    const item = screen.getByText('유지될 우선순위').closest('li') as HTMLElement;
    expect(within(item).getByRole('combobox')).toHaveValue('high');
  });

  it('priority 필드가 없는 기존 localStorage 데이터도 정상 동작한다', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 1, text: '레거시 항목', completed: false }]),
    );

    renderApp();

    const item = screen.getByText('레거시 항목').closest('li') as HTMLElement;
    expect(within(item).getByRole('combobox')).toHaveValue('medium');
  });
});

describe('마감일', () => {
  it('마감일을 지정하지 않으면 마감일이 없는 상태로 생성된다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '마감일 없음{Enter}');

    expect(screen.getByLabelText('마감일 없음 마감일')).toHaveValue('');
  });

  it('생성 시 마감일을 지정하면 해당 TODO에 마감일이 설정된다', async () => {
    const user = userEvent.setup();
    renderApp();

    fireEvent.change(screen.getByLabelText('마감일'), { target: { value: '2026-09-01' } });
    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '마감일 있음{Enter}');

    expect(screen.getByLabelText('마감일 있음 마감일')).toHaveValue('2026-09-01');
  });

  it('항목별 마감일 입력으로 기존 TODO의 마감일을 변경할 수 있다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '변경 대상{Enter}');
    fireEvent.change(screen.getByLabelText('변경 대상 마감일'), { target: { value: '2026-10-15' } });

    expect(screen.getByLabelText('변경 대상 마감일')).toHaveValue('2026-10-15');
  });

  it('마감일을 지우면 마감일이 없는 상태로 돌아간다', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '지울 대상{Enter}');
    fireEvent.change(screen.getByLabelText('지울 대상 마감일'), { target: { value: '2026-10-15' } });
    fireEvent.change(screen.getByLabelText('지울 대상 마감일'), { target: { value: '' } });

    expect(screen.getByLabelText('지울 대상 마감일')).toHaveValue('');
  });

  it('과거 날짜도 마감일로 지정할 수 있다', async () => {
    const user = userEvent.setup();
    renderApp();

    fireEvent.change(screen.getByLabelText('마감일'), { target: { value: '2020-01-01' } });
    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '과거 마감일{Enter}');

    expect(screen.getByLabelText('과거 마감일 마감일')).toHaveValue('2020-01-01');
  });

  it('동일 priority 내에서 마감일이 빠른 순으로 정렬된다', async () => {
    const user = userEvent.setup();
    renderApp();

    const input = screen.getByPlaceholderText('할 일을 입력하세요');
    const dateInput = screen.getByLabelText('마감일');

    fireEvent.change(dateInput, { target: { value: '2026-09-20' } });
    await user.type(input, '늦은 작업{Enter}');
    fireEvent.change(dateInput, { target: { value: '2026-09-10' } });
    await user.type(input, '빠른 작업{Enter}');

    const items = screen.getAllByRole('listitem').filter(el => !el.classList.contains('empty'));
    expect(items.map(el => el.textContent)).toEqual([
      expect.stringContaining('빠른 작업'),
      expect.stringContaining('늦은 작업'),
    ]);
  });

  it('동일 priority 내에서 마감일이 없는 TODO는 마감일이 있는 TODO 뒤에 정렬된다', async () => {
    const user = userEvent.setup();
    renderApp();

    const input = screen.getByPlaceholderText('할 일을 입력하세요');
    const dateInput = screen.getByLabelText('마감일');

    await user.type(input, '마감일 없는 작업{Enter}');
    fireEvent.change(dateInput, { target: { value: '2026-09-10' } });
    await user.type(input, '마감일 있는 작업{Enter}');

    const items = screen.getAllByRole('listitem').filter(el => !el.classList.contains('empty'));
    expect(items.map(el => el.textContent)).toEqual([
      expect.stringContaining('마감일 있는 작업'),
      expect.stringContaining('마감일 없는 작업'),
    ]);
  });

  it('마감일이 localStorage에 저장되고 재마운트 시 복원된다', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp();

    fireEvent.change(screen.getByLabelText('마감일'), { target: { value: '2026-11-05' } });
    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '유지될 마감일{Enter}');
    unmount();

    renderApp();

    expect(screen.getByLabelText('유지될 마감일 마감일')).toHaveValue('2026-11-05');
  });

  it('dueDate 필드가 없는 기존 localStorage 데이터도 마감일 없는 상태로 정상 동작한다', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ id: 1, text: '레거시 항목', completed: false, priority: 'medium' }]),
    );

    renderApp();

    expect(screen.getByLabelText('레거시 항목 마감일')).toHaveValue('');
  });
});

describe('localStorage persistence', () => {
  it('TODO 추가 후 다시 mount하면 localStorage에서 복원된다', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '유지될 항목{Enter}');
    unmount();

    renderApp();

    expect(screen.getByText('유지될 항목')).toBeInTheDocument();
  });

  it('TODO 삭제 후 다시 mount하면 삭제된 상태가 유지된다', async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp();

    await user.type(screen.getByPlaceholderText('할 일을 입력하세요'), '삭제될 항목{Enter}');
    await user.click(screen.getByRole('button', { name: '삭제' }));
    unmount();

    renderApp();

    expect(screen.queryByText('삭제될 항목')).not.toBeInTheDocument();
    expect(screen.getByText('할 일이 없습니다.')).toBeInTheDocument();
  });

  it('localStorage에 잘못된 JSON이 있어도 앱이 정상 동작한다', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-json{{{');

    renderApp();

    expect(screen.getByText('할 일이 없습니다.')).toBeInTheDocument();
  });
});
