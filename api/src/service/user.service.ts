import { Grade, MemberBase, MemberType, PrivateInfo } from '@/types/member';
import {
  UserRepoT,
  UserRepoWithPrivateInfoT,
} from '../repository/user.repository';
import { toDateISO } from '@/util';
import { CreateUserSchema } from '../validation';
import { CreatedAt, MemberPropertyTable } from '@/types/table';

export class UserService {
  /**
   * DBから取得したユーザー情報をフォーマットする
   * @param member
   * @returns
   */
  static toFormat(member: UserRepoT): MemberBase<{}, MemberType> {
    const { type } = member;

    const base: MemberBase = {
      id: member.id as number,
      updatedAt: toDateISO(member.updatedAt as number),
      firstName: member.firstName as string,
      lastName: member.lastName as string,
      firstNameKana: member.firstNameKana as string,
      lastNameKana: member.lastNameKana as string,
      graduationYear: member.graduationYear as number,
      slackName: member.slackName as string,
      iconUrl: member.iconUrl as string,
      skills: (member.skills as string).split(','),
    };

    switch (type) {
      case 'active':
        return {
          type: 'active',
          studentNumber: member.studentNumber as string,
          position: member.position as string,
          grade: member.grade as Grade,
          ...base,
        };
      case 'obog':
        return {
          type: 'obog',
          oldStudentNumber: member.oldStudentNumber as string,
          oldPosition: member.oldPosition as string,
          employment: member.employment as string,
          ...base,
        };
      case 'external':
        return {
          type: 'external',
          school: member.school as string,
          organization: member.organization as string,
          ...base,
        };
      default:
        throw new Error();
    }
  }

  /**
   * DBから取得したユーザー情報をフォーマットする(privateInfoあり)
   * @param member
   * @returns
   */
  static toFormatDetail(
    member: UserRepoWithPrivateInfoT,
  ): MemberBase<PrivateInfo, MemberType> {
    const { type } = member;

    const base: MemberBase<PrivateInfo> = {
      id: member.id as number,
      updatedAt: toDateISO(member.updatedAt as number),
      firstName: member.firstName as string,
      lastName: member.lastName as string,
      firstNameKana: member.firstNameKana as string,
      lastNameKana: member.lastNameKana as string,
      graduationYear: member.graduationYear as number,
      slackName: member.slackName as string,
      iconUrl: member.iconUrl as string,
      skills: (member.skills as string).split(','),
      privateInfo: {
        birthdate: member.privateInfo.birthdate as string,
        gender: member.privateInfo.gender as string,
        email: member.privateInfo.email as string,
        phoneNumber: member.privateInfo.phoneNumber as string,
        currentAddress: {
          address: member.privateInfo.currentAddress.address as string,
          postalCode: member.privateInfo.currentAddress.postalCode as string,
        },
        homeAddress: {
          address: member.privateInfo.homeAddress.address as string,
          postalCode: member.privateInfo.homeAddress.postalCode as string,
        },
      },
    };

    switch (type) {
      case 'active':
        return {
          type: 'active',
          studentNumber: member.studentNumber as string,
          position: member.position as string,
          grade: member.grade as Grade,
          ...base,
        };
      case 'obog':
        return {
          type: 'obog',
          oldStudentNumber: member.oldStudentNumber as string,
          oldPosition: member.oldPosition as string,
          employment: member.employment as string,
          ...base,
        };
      case 'external':
        return {
          type: 'external',
          school: member.school as string,
          organization: member.organization as string,
          ...base,
        };
      default:
        throw new Error();
    }
  }

  /**
   * ユーザー情報をフラットにする
   * @param member
   */
  static toFlatUser(
    member: CreateUserSchema['member'],
    uid: string,
    now: number,
  ): MemberPropertyTable<CreatedAt> {
    const { type } = member;

    const base = {
      uid: uid,
      createdAt: now,
      firstName: member.firstName,
      lastName: member.lastName,
      firstNameKana: member.firstNameKana,
      lastNameKana: member.lastNameKana,
      graduationYear: member.graduationYear,
      slackName: member.slackName,
      iconUrl: member.iconUrl,
      birthdate: member.privateInfo.birthdate,
      gender: member.privateInfo.gender,
      phoneNumber: member.privateInfo.phoneNumber,
      email: member.privateInfo.email,
      cuurentPostalCode: member.privateInfo.currentAddress.postalCode,
      currentAddress: member.privateInfo.currentAddress.address,
      homePostalCode: member.privateInfo.homeAddress.postalCode,
      homeAddress: member.privateInfo.homeAddress.address,
    };

    if (type === 'active') {
      return {
        type: 'active',
        studentNumber: member.studentNumber,
        position: member.position,
        grade: member.grade,
        ...base,
      };
    } else if (type === 'obog') {
      return {
        type: 'obog',
        oldPosition: member.oldPosition,
        oldStudentNumber: member.oldStudentNumber,
        employment: member.employment,
        ...base,
      };
    } else {
      return {
        type: 'external',
        school: member.school,
        organization: member.organization,
        ...base,
      };
    }
  }
}
