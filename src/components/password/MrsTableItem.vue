<template>
  <div class="mrs-item" data-flag="0">
    <div class="mrs-table-item">
      <div class="mrs-header">
        <p class="name">{{ data.title }}</p>
        <p class="time">{{ data.createDate }}</p>
      </div>
      <div class="content">
        <p>
          <span>标题: </span>
          <span>
            {{ data.userName }}
          </span>
        </p>
        <p>
          <span>账号: </span>
          <span class="allow-copy" @click="writeToClipboard(data.account)">
            {{ data.account }}
          </span>
        </p>
        <p>
          <span>密码: </span>
          <span class="allow-copy" @click="writeToClipboard(data.password)">
            {{ data.view_password }}
          </span>
          <span class="is-display iconfont" @click="displayPassword($event)">&#xe65a;</span>
        </p>
        <p><span>备注: </span><span>{{ data.view_remark }}</span></p>
      </div>
    </div>
    <div class="btn-box">
      <input class="mrs-edit-btn" @click="editRecord(item.id)" type="button" value="编 辑">
      <input class="mrs-delete-btn" @click="deleteRecord(item.id)" type="button" value="删 除">
    </div>
  </div>
</template>

<script lang="ts">

type Pops = {
  item: PasswordRecord
}

type Emits = {
  emit: Function
}

export default {
  name: "MrsTableItem",
  props: ['item', 'mrsKey'],
  emits: ["showDetails", "editRecord", "deleteRecord", "deleteBatch"],

  setup(pops: Readonly<Pops>, {emit}: Emits) {
    // 预处理渲染的数据
    const beforeRender = (): void => {
      const item: PasswordRecord = pops.item;
      item.view_password = "********";
      item.view_remark = item?.remark;
      if (item?.remark && item.remark.length > 10) {
        item.view_remark = (item.remark).substring(0, 10) + " ...";
      } else {
        if (!item?.remark) {
          item.view_remark = "-";
        } else {
          item.view_remark = item.remark;
        }
      }
      if (!item?.url) item.view_url = "-";
    }
    const showDetails = (id: number): void => emit("showDetails", id);
    const editRecord = (id: number): void => emit("editRecord", id);
    const deleteRecord = (id: number): void => emit("deleteRecord", id);
    const deleteBatch = (id: number): void => emit("deleteBatch", id);
    beforeRender();

    const data = pops.item;
    return {
      data,
      showDetails,
      editRecord,
      deleteRecord,
      deleteBatch
    };
  },

  data() {
    return {
      activeId: -1,
      showDisplay: false,
      num: 0
    };
  },

  mounted() {
    const that: any = this;
    const offsetNum: number = 120; // 滑动偏移量
    const nodeList = document.querySelectorAll(".mrs-item");
    const target = nodeList[that.mrsKey];
    // console.log(that.mrsKey);


    const callback1 = (target: HTMLDivElement) => {
      nodeList.forEach((e: any) => {
        e.style.transform = "translateX(0)";
      });
      target.dataset.flag = "1";
      target.style.transform = `translateX(-${offsetNum}px)`;
    };
    const callback2 = (target: HTMLDivElement) => {
      if (parseInt(target.dataset.flag + "") === 1) {
        target.dataset.flag = "0";
      } else {
        // 单击记录操作
        that.activeId = that.item.id;
        that.showDetails(that.activeId);
      }
      target.style.transform = "translateX(0)";
    };


    const targetList = [].slice.call(nodeList);
    that.slideHandler(targetList, target, callback1, callback2);
  },

  methods: {
    /**
     * 写入剪切板操作
     */
    writeToClipboard(str: string) {
      const that: any = this;
      that.$copyText(str);
      that.num = 1;
    },

    /**
     * 滑动操作
     * @param targetList .
     * @param target    .
     * @param callback1 .
     * @param callback2 .
     */
    slideHandler(targetList: Array<HTMLDivElement>, target: HTMLDivElement, callback1: Function, callback2: Function): void {
      const that: any = this; // this
      let timer: any = null;  // 定时器
      let longPressTimer: any = null; // 长按定时器

      const limitX = 10;      // x轴误触范围
      const limitY = 80;      // y轴误触范围
      const langPressLimit = 600;  // 长按等待时间
      const data = {
        slide_start_x: 0, // 开始滑动时的x坐标
        slide_start_y: 0, // 开始滑动时的y坐标
        slide_end_y: 0,   // 结束滑动时的x坐标
        slide_end_x: 0    // 结束滑动时的y坐标
      };
      const _callback2 = (target: HTMLDivElement): void => {
        callback2(target);
      }
      // console.log(targetList);
      // console.log(target);

      // 开始滑动
      target.addEventListener('touchstart', function (e: TouchEvent) {
        const pageXY = e.touches[0];
        data.slide_start_x = parseFloat((pageXY.pageX).toFixed(2));
        data.slide_start_y = parseFloat((pageXY.pageY).toFixed(2));

        // 长按事件
        longPressTimer = setTimeout(function () {
          that.deleteBatch(that.item.id);
          e.preventDefault();
        }, langPressLimit);

        e.stopPropagation();
      }, false);
      // 滑动中
      target.addEventListener('touchmove', function (e: TouchEvent) {
        const pageXY = e.changedTouches[0];
        data.slide_end_x = parseFloat((pageXY.pageX).toFixed(2));
        data.slide_end_y = parseFloat((pageXY.pageY).toFixed(2));
        clearInterval(timer);
        clearTimeout(longPressTimer);
        longPressTimer = null;
        timer = setInterval(() => {
          if (Math.abs(data.slide_start_y - data.slide_end_y) > 5) {
            targetList.forEach(e => {
              e.style.transform = "translateX(0)";
            })
          }
          if (
              (data.slide_start_x > data.slide_end_x + limitX)
              &&
              (Math.abs(data.slide_start_y - data.slide_end_y) < limitY)
          ) {
            if (data.slide_start_x > data.slide_end_x) {
              callback1(target);
            } else {
              callback2(target);
            }
          }
          data.slide_start_x = 0;
          data.slide_end_x = 0;
          clearInterval(timer);
        }, 100);
        e.stopPropagation();
      }, false);
      // 点击
      target.addEventListener('click', function (e: MouseEvent) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
        if (that.num !== 0) that.num = 0
        else {
          _callback2(target);
        }
        e.stopPropagation();
      }, false);
    },

    /**
     * 显示或隐藏密码
     */
    displayPassword(event: Event) {
      const that: any = this;
      const target: any = event.target;
      that.num = 1;
      that.showDisplay = !that.showDisplay;
      if (that.showDisplay) {
        that.data.view_password = that.data.password;
        target.innerHTML = "&#xe660;";
      } else {
        that.data.view_password = "********";
        target.innerHTML = "&#xe65a;"
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/common";

$btn-box-width: 120px;

.mrs-item {
  position: relative;
  transition: all 100ms;
  height: 150px;
  padding: 5px;

  .mrs-table-item {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    background: $color-primary-light-9;
    font-family: $font-content-family;
    color: #333;
    padding: 10px;
    border-radius: 5px;

    .mrs-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        font-family: "Microsoft YaHei", serif;
        font-weight: bold;
      }
    }

    .content {
      padding-left: 20px;

      p {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        span {
          margin: 0 5px;
        }

        .allow-copy {
          cursor: pointer;
        }

        .allow-copy::after {
          content: "点击复制";
          margin: 0 10px;
          color: $brand-blue;
          font: 11px/100% "Microsoft YaHei";
        }

        .is-display {
          position: absolute;
          top: 0;
          right: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          width: 25px;
          height: 25px;
          cursor: pointer;
        }
      }
    }
  }

  .btn-box {
    position: absolute;
    right: 0;
    top: 0;
    width: $btn-box-width;
    height: 100%;
    transform: translateX($btn-box-width);

    input[type="button"] {
      outline: none;
      border: 0;
      width: 50%;
      height: 100%;
      font-size: $font-content-size-16;
      line-height: $content-line-height;
      color: $classic-white;
    }

    .mrs-edit-btn {
      background: $brand-blue;
    }

    .mrs-delete-btn {
      background: $danger-red;
    }
  }
}
</style>
