import { fireEvent, render, screen } from '@testing-library/react';
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
