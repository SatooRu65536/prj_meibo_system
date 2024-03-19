import { useEffect } from 'react';
import { setLocalstorage } from '@/foundations/localstorage';
import {
  useEditMemberMutators,
  useEditMemberState,
} from '@/globalStates/editMemberState';
import { MemberAll, MemberType } from '@/type/member';

export default function useMember() {
  const editMember = useEditMemberState();
  const { setEditMemberState } = useEditMemberMutators();

  /**
   * memberをセットする
   * @param member {MemberAll} member
   */
  function setMember(member: MemberAll) {
    setEditMemberState(member);
  }

  /**
   * IDをセットする
   * @param id {number} ID
   */
  function setId(id: number) {
    setEditMemberState((prev) => ({ ...prev, id }));
  }

  /**
   * 名前をセットする
   * @param name {string}
   */
  function setName(name: string) {
    // eslint-disable-next-line no-irregular-whitespace
    const names = name.split(/[ 　]/);
    const [lastName, firstName] = names.filter((n) => n !== '');
    setEditMemberState((prev) => ({ ...prev, lastName, firstName }));
  }

  /**
   * 姓をセットする
   * @param lastName {string}
   */
  function setLastName(lastName: string) {
    setEditMemberState((prev) => ({ ...prev, lastName }));
  }

  /**
   * 名をセットする
   * @param firstName {string}
   */
  function setFirstName(firstName: string) {
    setEditMemberState((prev) => ({ ...prev, firstName }));
  }

  /**
   * 読み仮名をセットする
   * @param kana {string}
   */
  function setKana(kana: string) {
    // eslint-disable-next-line no-irregular-whitespace
    const kanas = kana.split(/[ 　]/);
    const [lastNameKana, firstNameKana] = kanas.filter((n) => n !== '');
    setEditMemberState((prev) => ({ ...prev, lastNameKana, firstNameKana }));
  }

  /**
   * 姓の読み仮名をセットする
   * @param lastNameKana {string}
   */
  function setLastNameKana(lastNameKana: string) {
    setEditMemberState((prev) => ({ ...prev, lastNameKana }));
  }

  /**
   * 名の読み仮名をセットする
   * @param firstNameKana {string}
   */
  function setFirstNameKana(firstNameKana: string) {
    setEditMemberState((prev) => ({ ...prev, firstNameKana }));
  }

  /**
   * skillsを追加する
   * @param skill {string}
   */
  function setSkills(skillStr: string) {
    // eslint-disable-next-line no-irregular-whitespace
    const skills = skillStr.split(/[,、][ 　]*/);
    setEditMemberState((prev) => ({ ...prev, skills }));
  }

  /**
   * graduationYearをセットする
   * @param graduationYear {number}
   */
  function setGraduationYear(graduationYear: number) {
    setEditMemberState((prev) => ({ ...prev, graduationYear }));
  }

  /**
   * slackNameをセットする
   * @param slackName {string}
   */
  function setSlackName(slackName: string) {
    setEditMemberState((prev) => ({ ...prev, slackName }));
  }

  /**
   * iconUrlをセットする
   * @param iconUrl {string}
   */
  function setIconUrl(iconUrl: string) {
    setEditMemberState((prev) => ({ ...prev, iconUrl }));
  }

  /**
   * typeをセットする
   * @param type {string}
   */
  function setType(type: MemberType) {
    setEditMemberState((prev) => ({ ...prev, type }));
  }

  /**
   * studentNumberをセットする
   * @param studentNumber {string}
   */
  function setStudentNumber(studentNumber: string) {
    setEditMemberState((prev) => ({ ...prev, studentNumber }));
  }

  /**
   * positionをセットする
   * @param position {string}
   */
  function setPosition(position: string) {
    setEditMemberState((prev) => ({ ...prev, position }));
  }

  /**
   * gradeをセットする
   * @param grade {string}
   */
  function setGrade(grade: string) {
    setEditMemberState((prev) => ({ ...prev, grade }));
  }

  /**
   * oldPositionをセットする
   * @param oldPosition {string}
   */
  function setOldPosition(oldPosition: string) {
    setEditMemberState((prev) => ({ ...prev, oldPosition }));
  }

  /**
   * oldStudentNumberをセットする
   * @param oldStudentNumber {string}
   */
  function setOldStudentNumber(oldStudentNumber: string) {
    setEditMemberState((prev) => ({ ...prev, oldStudentNumber }));
  }

  /**
   * employmentをセットする
   * @param employment {string}
   */
  function setEmployment(employment: string) {
    setEditMemberState((prev) => ({ ...prev, employment }));
  }

  /**
   * schoolをセットする
   * @param school {string}
   */
  function setSchool(school: string) {
    setEditMemberState((prev) => ({ ...prev, school }));
  }

  /**
   * organizationをセットする
   * @param organization {string}
   */
  function setOrganization(organization: string) {
    setEditMemberState((prev) => ({ ...prev, organization }));
  }

  /**
   * emailをセットする
   * @param email {string}
   */
  function setEmail(email: string) {
    setEditMemberState((prev) => ({
      ...prev,
      privateInfo: { ...prev.privateInfo, email },
    }));
  }

  /**
   * phoneNumberをセットする
   * @param phoneNumber {string}
   */
  function setPhoneNumber(phoneNumber: string) {
    setEditMemberState((prev) => ({
      ...prev,
      privateInfo: { ...prev.privateInfo, phoneNumber },
    }));
  }

  /**
   * birthdateをセットする
   * @param birthdate {string}
   */
  function setBirthdate(birthdate: string) {
    setEditMemberState((prev) => ({
      ...prev,
      privateInfo: { ...prev.privateInfo, birthdate },
    }));
  }

  /**
   * genderをセットする
   * @param gender {string}
   */
  function setGender(gender: string) {
    setEditMemberState((prev) => ({
      ...prev,
      privateInfo: { ...prev.privateInfo, gender },
    }));
  }

  /**
   * currentAddress.postalCodeをセットする
   * @param postalCode {string}
   */
  function setCurrentAddressPostalCode(postalCode: string) {
    setEditMemberState((prev) => ({
      ...prev,
      privateInfo: {
        ...prev.privateInfo,
        currentAddress: { ...prev.privateInfo.currentAddress, postalCode },
      },
    }));
  }

  /**
   * currentAddress.addressをセットする
   * @param address {string}
   */
  function setCurrentAddressAddress(address: string) {
    setEditMemberState((prev) => ({
      ...prev,
      privateInfo: {
        ...prev.privateInfo,
        currentAddress: { ...prev.privateInfo.currentAddress, address },
      },
    }));
  }

  /**
   * homeAddress.postalCodeをセットする
   * @param postalCode {string}
   */
  function setHomeAddressPostalCode(postalCode: string) {
    setEditMemberState((prev) => ({
      ...prev,
      privateInfo: {
        ...prev.privateInfo,
        homeAddress: { ...prev.privateInfo.homeAddress, postalCode },
      },
    }));
  }

  /**
   * homeAddress.addressをセットする
   * @param address {string}
   */
  function setHomeAddressAddress(address: string) {
    setEditMemberState((prev) => ({
      ...prev,
      privateInfo: {
        ...prev.privateInfo,
        homeAddress: { ...prev.privateInfo.homeAddress, address },
      },
    }));
  }

  useEffect(() => {
    setLocalstorage('editMember', editMember);
  }, [editMember]);

  return [
    editMember,
    {
      setMember,
      setId,
      setName,
      setLastName,
      setFirstName,
      setKana,
      setLastNameKana,
      setFirstNameKana,
      setSkills,
      setGraduationYear,
      setSlackName,
      setIconUrl,
      setType,
      setStudentNumber,
      setPosition,
      setGrade,
      setOldPosition,
      setOldStudentNumber,
      setEmployment,
      setSchool,
      setOrganization,
      setEmail,
      setPhoneNumber,
      setBirthdate,
      setGender,
      setCurrentAddressPostalCode,
      setCurrentAddressAddress,
      setHomeAddressPostalCode,
      setHomeAddressAddress,
    },
  ] as const;
}
