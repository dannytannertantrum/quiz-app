from uuid import uuid4

from app.helper_functions import choose_random_questions


class MockQuestion:
    def __init__(self, id):
        self.id = id


class TestHelperFunctionsFailure:
    def test_choose_random_questions_returns_empty_list_when_list_does_not_meet_min_length(
        self,
    ):
        too_short = [MockQuestion(id=uuid4()), MockQuestion(id=uuid4())]

        result = choose_random_questions(too_short, picked_questions=[])

        assert result == []


class TestHelperFunctionsSuccess:
    def test_choose_random_questions_returns_a_list_of_5_unique_values(self):
        good_list = [
            MockQuestion(id=uuid4()),
            MockQuestion(id=uuid4()),
            MockQuestion(id=uuid4()),
            MockQuestion(id=uuid4()),
            MockQuestion(id=uuid4()),
            MockQuestion(id=uuid4()),
            MockQuestion(id=uuid4()),
        ]

        result = choose_random_questions(good_list, picked_questions=[])
        unique_list = set(result)

        assert len(result) == 5
        assert len(result) == len(unique_list)
