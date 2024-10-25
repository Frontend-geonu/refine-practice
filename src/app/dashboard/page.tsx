"use client"

import { List, TagField, useTable } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Table } from "antd";
import { gql } from "graphql-tag";

const MEMBER_LEVEL_COMMMON = gql`
    fragment MemberLevelCommon on MemberLevel {
  id
  name
  iconUrl
}

`

const BOOKMARK_BUTTON_MENU = gql`
fragment BookmarkButton_menu on Menu {
  id
  bookmarkable
  viewerHasBookmarked
}
`

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
`

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
      pageCount(limit: $limit)
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
` 

const PostList: React.FC = () => {
  const aaa = useList({resource:"posts", meta:{gqlQuery:POST_LIST_QUERY}});

  console.log(aaa)
  return null;
  // return (
  //   <List>
  //     <Table {...tableProps} rowKey="id">
  //       <Table.Column dataIndex="id" title="ID" />
  //       <Table.Column dataIndex="title" title="Title" />
  //       <Table.Column dataIndex="content" title="Content" />
  //       <Table.Column
  //         dataIndex="status"
  //         title="Status"
  //         render={(value: string) => <TagField value={value} />}
  //       />
  //     </Table>
  //   </List>
  // );
};

export default PostList