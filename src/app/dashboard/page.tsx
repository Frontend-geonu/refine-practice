"use client";

import { useTable } from "@refinedev/antd";
import { Table } from "antd";
import { gql } from "graphql-tag";

const MEMBER_LEVEL_COMMMON = gql`
  fragment MemberLevelCommon on MemberLevel {
    id
    name
    iconUrl
  }
`;

const BOOKMARK_BUTTON_MENU = gql`
  fragment BookmarkButton_menu on Menu {
    id
    bookmarkable
    viewerHasBookmarked
  }
`;

const SCREEN_BOARD_MAIN_ALL_POSTS = gql`
  fragment ScreenBoardMain_AllPosts on Post {
    id
    title
    nickname
    likes
    createdAt
    views
    status
    score
    # isGlobalNotice
    # isBoardNotice
    postNumber
    scrapCount
    commentCount
    imageSrc
    youtubeSrc
    answeredByCoach
    isCoachAnswerSelected
    board {
      slug
      title
      showCoachValues
    }
    author {
      id
      nickname
      memberLevel {
        ...MemberLevelCommon
      }
      isAdmin
      isCoach
      coach {
        exposedQualificationName
      }
    }
  }

  ${MEMBER_LEVEL_COMMMON}
`;

const POST_LIST_QUERY = gql`
  query gqlPostCommunityV2(
    $orderBy: AllPostsOrderInput
    $pagination: Pagination
    $filterBy: AllPostsFiltersInput
    $limit: Int!
  ) {
    recentGlobalNoticePosts {
      ...ScreenBoardMain_AllPosts
      isGlobalNotice
      isBoardNotice
    }
    allPosts(pagination: $pagination, orderBy: $orderBy, filterBy: $filterBy) {
      nodes {
        isNotice
        ...ScreenBoardMain_AllPosts
      }
      count: pageCount(limit: $limit)
    }
    boardBySlug(boardSlug: "community") {
      id
      title
      subTitle
      anonymity
      anonymous
      globalNoticeHidden
      menu {
        ...BookmarkButton_menu
      }
    }
  }

  ${SCREEN_BOARD_MAIN_ALL_POSTS}
  ${BOOKMARK_BUTTON_MENU}
`;

const PostList: React.FC = () => {
  const { tableProps } = useTable({
    resource: "allPosts",
    meta: { gqlQuery: POST_LIST_QUERY },
  });

  return (
    <Table {...tableProps} rowKey="id" className="m-10">
      <Table.Column dataIndex="id" title="ID" />
      <Table.Column dataIndex="title" title="제목" />
      <Table.Column dataIndex="nickname" title="닉네임" />
      <Table.Column dataIndex="views" title="조회수" />
      <Table.Column dataIndex="likes" title="좋아요수" />
      <Table.Column
        dataIndex="imageSrc"
        title="썸네일"
        render={(imageSrc) => (
          <img src={imageSrc} alt="이미지" width="50" height="50" />
        )}
      />
    </Table>
  );
};

export default PostList;
