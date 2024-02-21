import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import getLocalstorage from '../foundations/localstorage';
import { MemberAll, Nullable } from '@/type/member';

const init: Nullable<MemberAll> = {
  id: null,
  firstName: null,
  lastName: null,
  firstNameKana: null,
  lastNameKana: null,
  skills: [],
  graduationYear: null,
  slackName: null,
  iconUrl: null,
  updatedAt: null,
  createdAt: null,
  type: null,

  studentNumber: null,
  position: null,
  grade: null,

  oldPosition: null,
  oldStudentNumber: null,
  employment: null,

  school: null,
  organization: null,

  privateInfo: {
    email: null,
    phoneNumber: null,
    birthdate: null,
    gender: null,
    currentAddress: {
      postalCode: null,
      address: null,
    },
    homeAddress: {
      postalCode: null,
      address: null,
    },
  },
};

const editMemberState = atom<Nullable<MemberAll>>({
  key: 'editMemberState',
  default: getLocalstorage<Nullable<MemberAll>>('editMember', init),
});

export const useEditMemberState = () => {
  return useRecoilValue(editMemberState);
};

export const useEditMemberMutators = () => {
  const setEditMemberState = useSetRecoilState(editMemberState);
  return { setEditMemberState };
};
